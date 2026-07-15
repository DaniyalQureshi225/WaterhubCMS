import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export async function getAdvertisements(params = {}) {
  const { data } = await apiClient.get(ENDPOINTS.ADVERTISEMENTS.LIST, { params })
  return data
}

export async function createAdvertisement(formData) {
  const { data } = await apiClient.post(ENDPOINTS.ADVERTISEMENTS.CREATE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateAdvertisement(id, formData) {
  const { data } = await apiClient.put(ENDPOINTS.ADVERTISEMENTS.UPDATE(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteAdvertisement(id) {
  const { data } = await apiClient.delete(ENDPOINTS.ADVERTISEMENTS.DELETE(id))
  return data
}
