
import guestApiRequest from "@/apiRequests/guest"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: guestApiRequest.login
  })
}

export const useGuestLogoutMutation = () => {
    return useMutation({
    mutationKey: ['logout'],
    mutationFn: guestApiRequest.logout
  })
}

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationKey: ['order'],
    mutationFn: guestApiRequest.order
  })
}

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryKey: ['getOrderList'],
    queryFn: guestApiRequest.getOrderList
  })
}
