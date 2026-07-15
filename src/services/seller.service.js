import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import { buildQueryString } from '@/api/queryParams'

export async function getSellers(params = {}) {
  const { data } = await apiClient.get(`${ENDPOINTS.SELLERS.LIST}${buildQueryString(params)}`)
  return data
}

export async function getSellerDetails(id) {
  const { data } = await apiClient.get(ENDPOINTS.SELLERS.DETAILS(id))
  return data
}
