'use client'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/app/lib/utils'
import Quantity from './quantity'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useRouter } from 'next/navigation'
import { DishStatus } from '@/constants/type'

export const MenuOrder = () => {
  const { data } = useDishListQuery()
  const dishes = data?.payload.data ?? []
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const { mutateAsync } = useGuestOrderMutation()
  const router = useRouter()
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((o) => o.dishId === dish.id)
      if (order) {
        result += order.quantity * dish.price
      }
      return result
    }, 0)
  }, [orders, dishes])

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if(index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { dishId, quantity }
      return newOrders
    })
  }

  const handleOrder = async () => {
    try {
      await mutateAsync(orders)
      router.push('/guest/orders')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {dishes.filter((dish) => dish.status !== DishStatus.Hidden).map((dish) => (
        <div key={dish.id} className={cn('flex gap-4', { 'pointer-events-none opacity-50': dish.status === DishStatus.Unavailable })}>
          <div className='shrink-0 relative'>
            <span className='absolute inset-0 flex items-center justify-center text-sm'>{dish.status === DishStatus.Unavailable && 'Hết hàng'}</span>
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-20 h-20 rounded-md'
              unoptimized
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{dish.name}</h3>
            <p className='text-xs'>{dish.description}</p>
            <p className='text-xs font-semibold'>{formatCurrency(dish.price)} đ</p>
          </div>
          <div className='shrink-0 ml-auto flex justify-center items-center'>
            <Quantity onChange={(value) => handleQuantityChange(dish.id, value)} value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0} />
          </div>
        </div>
      ))}
      <div className='sticky bottom-0'>
        <Button className='w-full justify-between cursor-pointer' disabled={orders.length === 0} onClick={handleOrder}>
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
