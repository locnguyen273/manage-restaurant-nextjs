'use client'

import { socket } from '@/app/lib/socket'
import { formatCurrency, getVietnameseOrderStatus } from '@/app/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import { UpdateOrderResType } from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

export default function OrderCart() {
  const { data, refetch } = useGuestGetOrderListQuery()
  const orders = data?.payload.data ?? []

  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      result += order.quantity * order.dishSnapshot.price
      return result
    }, 0)
  }, [orders])

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log("disconnect")
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const { dishSnapshot: { name }, quantity } = data
      toast.success(`Món ăn ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(data.status)}"`)
      refetch()
      console.log("update-order", data)
    }

    socket.on("update-order", onUpdateOrder)

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, [])

  return (
    <>
      {orders.map((order) => {
        return (
          <div key={order.id} className='flex gap-4'>
            <div className='shrink-0 relative'>
              <Image
                src={order.dishSnapshot.image}
                alt={order.dishSnapshot.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-20 h-20 rounded-md'
                unoptimized
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
              <div className='text-xs font-semibold'>
                {formatCurrency(order.dishSnapshot.price)} x <Badge className='px-1'>{order.quantity}</Badge>
              </div>
            </div>
            <div className='shrink-0 ml-auto flex justify-center items-center'>
              <Badge variant={'outline'}>{getVietnameseOrderStatus(order.status)}</Badge>
            </div>
          </div>
        )
      })}
      <div className='sticky bottom-0'>
        <div className='w-full justify-between cursor-pointer text-xl font-bold flex items-center space-x-4 p-4 border-t'>
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  )
}
