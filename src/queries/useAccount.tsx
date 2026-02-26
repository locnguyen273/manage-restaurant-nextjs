import accountApiRequest from '@/apiRequests/account'
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountProfile = (onSuccess?: (data: AccountResType) => void) => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () => accountApiRequest.me().then(res => {
      if(onSuccess) onSuccess(res.payload)
      return res
    }),
    
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: (body: UpdateMeBodyType) => accountApiRequest.updateMe(body)
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (body: ChangePasswordBodyType) => accountApiRequest.changePassword(body)
  })
}
