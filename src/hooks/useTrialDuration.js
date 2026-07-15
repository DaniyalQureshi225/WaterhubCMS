'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTrialDuration, updateTrialDuration } from '@/services/settings.service'

export function useTrialDuration() {
  return useQuery({
    queryKey: ['trial-duration'],
    queryFn: getTrialDuration,
    select: (res) => res.data?.trialDays ?? 7,
  })
}

export function useUpdateTrialDuration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (trialDays) => updateTrialDuration(trialDays),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trial-duration'] })
    },
  })
}
