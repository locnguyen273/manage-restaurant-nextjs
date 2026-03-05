import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from 'sonner'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast('Lỗi', {
      // title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      // variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('accessToken') : null
}

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}

export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser ? localStorage.setItem('accessToken', value) : null
}

export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser ? localStorage.setItem('refreshToken', value) : null
}

export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }

  const now = (new Date().getTime() / 1000) - 1
  // trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage()
    return param?.onError && param.onError()
  }
  // vd accessToken của chúng ta có tgian hết hạn là 10s, thì mình sữ ktra còn 1/3 tgian nữa là 3s thì sẽ refresh Token lại
  // tgian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // tgian hết hạn của accessToken dựa trên công thức như sau: decodedAccessToken.exp - decodedAccessToken.iat
  if (decodedAccessToken.exp - now <= (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // gọi api refresh token để lấy access token mới
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}
