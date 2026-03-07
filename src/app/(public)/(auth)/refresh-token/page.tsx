'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/app/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')
  const ref = useRef<any>(null)

  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || '/')
        },
        onError() {
          router.push('/login')
        }
      })
    } else {
      router.push('/')
    }
  }, [router, refreshTokenFromUrl, redirectPathname])
  return <div className=''>Refresh token...</div>
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  )
}
