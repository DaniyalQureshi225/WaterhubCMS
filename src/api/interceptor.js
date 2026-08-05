import apiClient from './axios'
import { STORAGE_KEYS } from '@/constants/storage'

let isRefreshing = false
let failedQueue = []
let refreshTimeoutId = null

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

function processQueue(error, token = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
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

async function attemptTokenRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  // Create a separate axios instance for refresh to avoid interceptor loops
  const { default: axios } = await import('axios')
  const refreshClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  })

  try {
    const response = await refreshClient.post('/auth/refresh-token', { refreshToken })
    const { accessToken, refreshToken: newRefreshToken } = response.data

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
      }
    }

    return accessToken
  } catch (error) {
    clearStorage()
    throw error
  }
}

export function setupInterceptors() {
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Don't retry auth endpoints
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(normalizeError(error))
      }

      // Handle network errors - don't logout, just reject with normalized error
      if (isNetworkError(error)) {
        console.log('[Auth] Network error detected, not logging out:', error.message)
        return Promise.reject(normalizeError(error))
      }

      // Handle 401 - token expired, try to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return apiClient(originalRequest)
            })
            .catch(err => Promise.reject(normalizeError(err)))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const newAccessToken = await attemptTokenRefresh()
          processQueue(null, newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed - clear storage but DON'T redirect automatically
          // Let the query fail naturally so React Query can handle it
          processQueue(refreshError, null)
          clearStorage()
          // Don't redirect here - let the app handle auth state
          return Promise.reject(normalizeError(refreshError))
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(normalizeError(error))
    }
  )
}

function normalizeError(error) {
  const normalized = { ...error }

  if (isNetworkError(error)) {
    normalized.isNetworkError = true
    normalized.userMessage = 'No internet connection. Please check your network and try again.'
  } else if (error.response?.status === 401) {
    normalized.isAuthError = true
    normalized.userMessage = error.response?.data?.message || 'Your session has expired. Please log in again.'
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

export function refreshAccessToken() {
  return attemptTokenRefresh()
}

export { getAccessToken, getRefreshToken, clearStorage, redirectToLogin }
export { isNetworkError, normalizeError }