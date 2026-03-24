import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/app/lib/http'
import { GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import guestApiRequest from '@/apiRequests/guest'

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType
  const cookieStore = cookies()
  try {
    const { payload } = await guestApiRequest.sLogin(body)
    const { accessToken, refreshToken } = payload.data;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }

    (await cookieStore).set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      expires: decodedAccessToken.exp * 1000,
      secure: true
    });

    (await cookieStore).set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      expires: decodedRefreshToken.exp * 1000,
      secure: true
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: 'Lỗi máy chủ' }, { status: 500 });
    }
  }
}
