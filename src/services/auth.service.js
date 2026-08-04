import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export async function login(payload) {
  const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, payload)
  return data
}

export async function logout() {
  const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
  return data
}

export async function getProfile() {
  const { data } = await apiClient.get(ENDPOINTS.AUTH.ME)
  return data
}

export async function refreshToken(refreshToken) {
  const { data } = await apiClient.post(ENDPOINTS.AUTH.REFRESH, { refreshToken })
  return data
}

export async function changePassword(payload) {
  const { data } = await apiClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload)
  return data
}
