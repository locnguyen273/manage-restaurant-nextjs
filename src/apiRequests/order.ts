import http from '@/app/lib/http'
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema'

const prefix = '/orders'
const orderApiRequest = {
  getOrderList: () => http.get<GetOrdersResType>(`${prefix}`),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body)
}

export default orderApiRequest