import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/app/lib/http'
import guestApiRequest from '@/apiRequests/guest'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json({ message: 'Không tìm thấy refresh token' }, { status: 401 })
  }
  try {
    const { payload } = await guestApiRequest.sRefreshToken({ refreshToken })

    const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      expires: decodedAccessToken.exp * 1000,
      secure: true
    })

    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      expires: decodedRefreshToken.exp * 1000,
      secure: true
    })
    return Response.json(payload)
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status })
    } else {
      return Response.json({ message: error.message ?? 'Lỗi máy chủ' }, { status: 401 })
    }
  }
}
