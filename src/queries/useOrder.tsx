import orderApiRequest from '@/apiRequests/order'
import { CreateOrdersBodyType, GetOrdersQueryParamsType, PayGuestOrdersBodyType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) =>
      orderApiRequest.updateOrder(orderId, body)
  })
}

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderList(queryParams),

    queryKey: ['getOrderList', queryParams]
  })
}

export const useGetOrderDetailsQuery = ({ id, enabled }: { id: number; enabled?: boolean }) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetails(id),
    queryKey: ['getOrderDetails', id],
    enabled
  })
}

export const usePayForGuestMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.pay(body)
  })
}

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (body: CreateOrdersBodyType) => orderApiRequest.createOrders(body)
  })
}
