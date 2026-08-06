'use client'

import { useEffect, useCallback } from 'react'
import { getAccessToken, getRefreshToken, ensureFreshAccessToken } from '@/api/interceptor'

const REFRESH_THRESHOLD_MS = 5 * 60 * 1000
const CHECK_INTERVAL_MS = 2 * 60 * 1000

function tokenExpiryMs(token) {
  if (!token || token.split('.').length !== 3) return null
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    ))
    return payload?.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function useProactiveTokenRefresh() {
  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken || !refreshToken) {
      return
    }

    const expiryMs = tokenExpiryMs(accessToken)
    if (expiryMs == null) {
      return
    }

    const timeUntilExpiry = expiryMs - Date.now()

    if (timeUntilExpiry < REFRESH_THRESHOLD_MS) {
      console.log('[ProactiveRefresh] Token expiring soon, refreshing...')
      try {
        await ensureFreshAccessToken({ minRemainingMs: REFRESH_THRESHOLD_MS })
        console.log('[ProactiveRefresh] Token refreshed successfully')
      } catch (error) {
        console.log('[ProactiveRefresh] Token refresh failed:', error.message)
      }
    }
  }, [])

  useEffect(() => {
    checkAndRefreshToken()

    const interval = setInterval(() => {
      checkAndRefreshToken()
    }, CHECK_INTERVAL_MS)

    const handleFocus = () => checkAndRefreshToken()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAndRefreshToken()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [checkAndRefreshToken])
}

export function ProactiveTokenRefresher() {
  useProactiveTokenRefresh()
  return null
}
