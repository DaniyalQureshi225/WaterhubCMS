import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import { buildQueryString } from '@/api/queryParams'

export async function getCustomers(params = {}) {
  const { data } = await apiClient.get(`${ENDPOINTS.CUSTOMERS.LIST}${buildQueryString(params)}`)
  return data
}
