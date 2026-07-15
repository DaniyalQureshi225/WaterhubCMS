'use client'

import { useQuery } from '@tanstack/react-query'
import { getPlans } from '@/services/subscription.service'

export function useAdminPlans() {
  return useQuery({
    queryKey: ['admin-plans'],
    queryFn: getPlans,
    select: (res) => {
      const raw = res.data || []
      return raw.map(p => ({
        ...p,
        id: p._id,
        status: p.status?.toLowerCase() || 'active',
      }))
    },
  })
}
