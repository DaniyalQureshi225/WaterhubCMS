import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export async function getDashboard() {
  const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.HOME)
  return data
}
