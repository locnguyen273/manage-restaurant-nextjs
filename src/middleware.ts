import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { decodedToken } from './app/lib/utils'
import { Role } from '@/constants/type'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  //1.chưa đăng nhập thì không cho truy cập vào trang private
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2. trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2.2 nhưng accessToken hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // 2.3 vào k đúng role, redirect về trang chủ
    const role = decodedToken(refreshToken).role
    // guest nhưng cố vào role owner
    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    // k phải guest nhưng cố vào role guest
    const isNotGuestGoToManagePath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
    if (isGuestGoToManagePath || isNotGuestGoToManagePath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/manage/:path*', '/guest/:paths*', '/login']
}
