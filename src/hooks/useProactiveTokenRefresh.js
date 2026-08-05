'use client'

import { useEffect, useCallback } from 'react'
import { getAccessToken, getRefreshToken, refreshAccessToken } from '@/api/interceptor'

export function useProactiveTokenRefresh() {
  const parseJwt = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }, [])

  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken || !refreshToken) {
      return
    }

    const payload = parseJwt(accessToken)
    if (!payload?.exp) {
      return
    }

    const expiryTime = payload.exp * 1000
    const now = Date.now()
    const timeUntilExpiry = expiryTime - now

    // Refresh if token expires within 5 minutes
    const refreshThreshold = 5 * 60 * 1000

    if (timeUntilExpiry < refreshThreshold && timeUntilExpiry > 0) {
      console.log('[ProactiveRefresh] Token expiring soon, refreshing...')
      try {
        await refreshAccessToken()
        console.log('[ProactiveRefresh] Token refreshed successfully')
      } catch (error) {
        console.log('[ProactiveRefresh] Token refresh failed:', error.message)
      }
    }
  }, [parseJwt])

  useEffect(() => {
    // Initial check
    checkAndRefreshToken()

    // Check every 2 minutes
    const interval = setInterval(() => {
      checkAndRefreshToken()
    }, 2 * 60 * 1000)

    // Also check on focus
    const handleFocus = () => checkAndRefreshToken()
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [checkAndRefreshToken])
}

export function ProactiveTokenRefresher() {
  useProactiveTokenRefresh()
  return null
}