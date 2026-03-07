import accountApiRequest from '@/apiRequests/account'
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountProfile = (onSuccess?: (data: AccountResType) => void) => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) onSuccess(res.payload)
        return res
      })
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

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list
  })
}

export const useGetAccount = ({ id, enabled }: { id: number, enabled: boolean }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled,
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({   
        queryKey: ['accounts']
      })
    }
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
        exact: true
      })
    }
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => accountApiRequest.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      })
    }
  })
}
