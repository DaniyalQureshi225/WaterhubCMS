import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import { buildQueryString } from '@/api/queryParams'

export async function getNotifications(params = {}) {
  const { data } = await apiClient.get(`${ENDPOINTS.NOTIFICATIONS.LIST}${buildQueryString(params)}`)
  return data
}

export async function createNotification(formData) {
  const { data } = await apiClient.post(ENDPOINTS.NOTIFICATIONS.CREATE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteNotification(id) {
  const { data } = await apiClient.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id))
  return data
}
