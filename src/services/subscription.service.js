import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'
import { buildQueryString } from '@/api/queryParams'

export async function getSubscriptions(params = {}) {
  const { data } = await apiClient.get(`${ENDPOINTS.SUBSCRIPTIONS.LIST}${buildQueryString(params)}`)
  return data
}

export async function getSubscriptionById(id) {
  const { data } = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.DETAILS(id))
  return data
}

export async function approveSubscription(id) {
  const { data } = await apiClient.patch(ENDPOINTS.SUBSCRIPTIONS.APPROVE(id))
  return data
}

export async function rejectSubscription(id, reason) {
  const { data } = await apiClient.patch(ENDPOINTS.SUBSCRIPTIONS.REJECT(id), { reason })
  return data
}

export async function getPlans() {
  const { data } = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.PLANS.LIST)
  return data
}

export async function getPlanById(id) {
  const { data } = await apiClient.get(ENDPOINTS.SUBSCRIPTIONS.PLANS.DETAILS(id))
  return data
}

export async function createPlan(payload) {
  const { data } = await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.PLANS.CREATE, payload)
  return data
}

export async function updatePlan({ id, ...payload }) {
  const { data } = await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.PLANS.UPDATE(id), payload)
  return data
}

export async function deletePlan(id) {
  const { data } = await apiClient.delete(ENDPOINTS.SUBSCRIPTIONS.PLANS.DELETE(id))
  return data
}
