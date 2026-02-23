import authApiRequest from "@/apiRequests/auth"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: authApiRequest.login
  })
}

export const useLogoutMutation = () => {
    return useMutation({
    mutationKey: ['logout'],
    mutationFn: authApiRequest.logout
  })
}
