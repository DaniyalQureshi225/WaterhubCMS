import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import { buildQueryString } from '@/api/queryParams'

export async function getCrashLogs(params = {}) {
  const { data } = await apiClient.get(`${ENDPOINTS.CRASH_LOGS.LIST}${buildQueryString(params)}`)
  return data
}

export async function getCrashLogById(id) {
  const { data } = await apiClient.get(ENDPOINTS.CRASH_LOGS.DETAILS(id))
  return data
}

export async function deleteCrashLog(id) {
  const { data } = await apiClient.delete(ENDPOINTS.CRASH_LOGS.DELETE(id))
  return data
}
