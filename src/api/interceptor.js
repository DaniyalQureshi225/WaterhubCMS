import apiClient from './axios'
import { STORAGE_KEYS } from '@/constants/storage'

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
      if (error.response?.status === 401) {
        clearStorage()
        redirectToLogin()
      }
      return Promise.reject(error)
    }
  )
}

export function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return Promise.reject(new Error('No refresh token'))

  return apiClient.post('/auth/refresh-token', { refreshToken })
}

export { getAccessToken, getRefreshToken, clearStorage, redirectToLogin }
