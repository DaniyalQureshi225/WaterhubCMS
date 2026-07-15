import apiClient from '@/api/axios'
import { ENDPOINTS } from '@/api/endpoints'

export async function getTrialDuration() {
  const { data } = await apiClient.get(ENDPOINTS.SETTINGS.TRIAL_DURATION)
  return data
}

export async function updateTrialDuration(trialDays) {
  const { data } = await apiClient.patch(ENDPOINTS.SETTINGS.TRIAL_DURATION, { days: trialDays })
  return data
}
