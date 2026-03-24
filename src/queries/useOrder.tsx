import orderApiRequest from "@/apiRequests/order"
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) => orderApiRequest.updateOrder(orderId, body)
  })
}

export const useGetOrderListQuery = () => {
  return useQuery({
    queryKey: ['getOrderList'],
    queryFn: orderApiRequest.getOrderList
  })
}
