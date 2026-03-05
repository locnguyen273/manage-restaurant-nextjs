import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  //chưa đăng nhập thì không cho truy cập vào trang private
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // đăng nhập rồi thì không cho truy cập vào trang Login
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // trường hợp đăng nhập rồi nhưng accessToken hết hạn
  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    const url = new URL('/logout', request.url)
    url.searchParams.set('refreshToken', refreshToken || '')
    url.searchParams.set('redirect', pathname )
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login']
}
