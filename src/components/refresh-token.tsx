'use client'

import { checkAndRefreshToken } from '@/app/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']

export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return
    let interval: any = null
    // pahri gọi lần đầu tiên, vì interval sẽ chạy sau tgian timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
        router.push('/login')
      }
    })
    // timeout interval phải bé hơn tgian hết hạn của accessToken, vd tgian hết hạn accessToken là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval)
            router.push('/login')
          }
        }),
      TIMEOUT
    )
  }, [pathname, router])
  return null
}
