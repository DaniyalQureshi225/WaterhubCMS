import apiClient from './axios'
import { STORAGE_KEYS } from '@/constants/storage'
import { emitSessionExpired } from '@/api/sessionEvents'

const REFRESH_TIMEOUT_MS = 20000
const DEFAULT_MIN_REMAINING_MS = 60 * 1000
const DEBUG = true

let refreshInFlight = null

function log(...args) {
  if (DEBUG && typeof window !== 'undefined') {
    console.log('[Interceptor]', ...args)
  }
}

function maskToken(token) {
  if (!token) return 'none'
  return `${token.slice(0, 8)}...${token.slice(-4)}`
}

function getAccessToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

function getRefreshToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

function clearStorage() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

function redirectToLogin() {
  if (typeof window === 'undefined') return
  window.location.href = '/'
}

function isNetworkError(error) {
  if (!error) return false
  if (error.code === 'ECONNABORTED') return true
  if (error.message?.includes('Network Error')) return true
  if (error.message?.includes('timeout')) return true
  if (error.message?.includes('Failed to fetch')) return true
  if (error.message?.includes('ERR_CONNECTION_REFUSED')) return true
  if (error.message?.includes('ERR_NAME_NOT_RESOLVED')) return true
  if (error.message?.includes('ERR_INTERNET_DISCONNECTED')) return true
  if (error.response === undefined && error.request) return true
  return false
}

function getTokenExpiryMs(token) {
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

function isTokenNearExpiry(token, minRemainingMs) {
  const expiryMs = getTokenExpiryMs(token)
  if (expiryMs == null) return false
  return expiryMs - Date.now() < minRemainingMs
}

function setTokens(accessToken, refreshToken) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }
}

function normalizeError(error) {
  const normalized = { ...error }

  if (isNetworkError(error)) {
    normalized.isNetworkError = true
    normalized.userMessage = 'No internet connection. Please check your network and try again.'
  } else if (error.response?.status === 401) {
    normalized.isAuthError = true
    normalized.userMessage = error.response?.data?.message || 'Unauthorized. Please log in again.'
  } else if (error.response?.status === 400) {
    normalized.isValidationError = true
    normalized.userMessage = error.response?.data?.message || 'Invalid request. Please check your input.'
  } else if (error.response?.status === 403) {
    normalized.isForbidden = true
    normalized.userMessage = 'You do not have permission to perform this action.'
  } else if (error.response?.status === 404) {
    normalized.isNotFound = true
    normalized.userMessage = 'The requested resource was not found.'
  } else if (error.response?.status >= 500) {
    normalized.isServerError = true
    normalized.userMessage = 'Server error. Please try again later.'
  } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    normalized.isTimeout = true
    normalized.userMessage = 'Request timed out. Please try again.'
  } else {
    normalized.userMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.'
  }

  return normalized
}

async function performRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    const err = new Error('No refresh token available')
    err.isNoSession = true
    throw err
  }

  const { default: axios } = await import('axios')
  const refreshClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  })

  let response
  try {
    response = await refreshClient.post('/auth/refresh-token', { refreshToken })
  } catch (error) {
    const status = error.response?.status
    const isGenuineExpiry = status === 401 || status === 403
    if (isGenuineExpiry) {
      clearStorage()
      emitSessionExpired('refresh-rejected')
      const authErr = new Error('Your session has expired. Please log in again.')
      authErr.isAuthError = true
      authErr.userMessage = authErr.message
      throw authErr
    }
    const transientErr = normalizeError(error)
    transientErr.isRefreshTransient = true
    throw transientErr
  }

  const { accessToken, refreshToken: newRefreshToken } = response.data || {}
  if (!accessToken) {
    throw new Error('Refresh response did not include an access token')
  }

  setTokens(accessToken, newRefreshToken || refreshToken)
  return accessToken
}

function refreshWithWatchdog() {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      const err = { message: 'Refresh request timed out. Please try again.' }
      err.isRefreshTransient = true
      err.isTimeout = true
      reject(err)
    }, REFRESH_TIMEOUT_MS)
  })
  return Promise.race([performRefresh(), timeout])
}

export function ensureFreshAccessToken({ minRemainingMs = DEFAULT_MIN_REMAINING_MS } = {}) {
  const accessToken = getAccessToken()
  if (accessToken && !isTokenNearExpiry(accessToken, minRemainingMs)) {
    return Promise.resolve(accessToken)
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshWithWatchdog().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

export function refreshAccessToken() {
  return ensureFreshAccessToken({ minRemainingMs: 0 })
}

export function setupInterceptors() {
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      log('Request:', config.method?.toUpperCase(), config.url, { token: maskToken(token) })
      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => {
      log('Response:', response.config?.method?.toUpperCase(), response.config?.url, { status: response.status })
      return response
    },
    async (error) => {
      const originalRequest = error.config
      log('Response error:', originalRequest?.method?.toUpperCase(), originalRequest?.url, {
        status: error.response?.status,
        network: isNetworkError(error),
        message: error.message,
      })

      if (!originalRequest) {
        return Promise.reject(normalizeError(error))
      }

      const isLoginUrl = originalRequest.url === '/auth/admin/login' || originalRequest.url?.endsWith('/login')
      const isRefreshUrl = originalRequest.url?.includes('/refresh-token')

      if (isLoginUrl || isRefreshUrl) {
        return Promise.reject(normalizeError(error))
      }

      if (isNetworkError(error)) {
        return Promise.reject(normalizeError(error))
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        log('401 detected, refreshing access token')
        try {
          const token = await ensureFreshAccessToken()
          log('Token refreshed, retrying request:', originalRequest.url, { token: maskToken(token) })
          const retryConfig = {
            ...originalRequest,
            headers: { ...originalRequest.headers },
          }
          retryConfig.headers.Authorization = `Bearer ${token}`
          return apiClient(retryConfig)
        } catch (refreshError) {
          log('Refresh failed:', refreshError.message)
          return Promise.reject(normalizeError(refreshError))
        }
      }

      if (error.response?.status === 401) {
        log('Session invalid after refresh, emitting session-expired')
        clearStorage()
        emitSessionExpired('invalid-token')
        const authErr = new Error('Your session has expired. Please log in again.')
        authErr.isAuthError = true
        authErr.userMessage = authErr.message
        return Promise.reject(authErr)
      }

      return Promise.reject(normalizeError(error))
    }
  )
}

export { getAccessToken, getRefreshToken, clearStorage, redirectToLogin }
export { isNetworkError, normalizeError }
