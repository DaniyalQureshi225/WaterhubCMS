'use client'

import { useQuery } from '@tanstack/react-query'
import { getSubscriptions } from '@/services/subscription.service'

function fmtDate(iso) {
  if (!iso) return 'N/A'
  return iso.split('T')[0]
}

function daysBetween(a, b) {
  return Math.max(0, Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)))
}

function normalizeSubscription(s) {
  const seller = s.seller || {}
  const status = (s.status || '').toLowerCase()
  const plan = s.plan || ''
  const startDate = fmtDate(s.startDate)
  const endDate = fmtDate(s.endDate)
  return {
    id: s._id,
    sellerName: seller.shopName || seller.ownerName || 'N/A',
    shopName: seller.shopName || 'N/A',
    phone: seller.phone || s.phone || 'N/A',
    email: seller.email || '',
    plan,
    type: s.type || '',
    status,
    startDate,
    expiryDate: endDate,
    daysRemaining: status === 'active' ? daysBetween(new Date(), new Date(s.endDate)) : 0,
    amount: s.amount || 0,
    autoRenewal: false,
    paymentScreenshot: s.paymentScreenshot || null,
    paymentDate: startDate,
    requestedOn: fmtDate(s.createdAt),
    paymentRef: '',
  }
}

export function useAdminSubscriptions(params = {}) {
  return useQuery({
    queryKey: ['admin-subscriptions', params],
    queryFn: () => getSubscriptions(params),
    select: (res) => {
      const raw = res.data || []
      const meta = res.meta || {}
      const subscriptions = raw.map(normalizeSubscription)
      const pendingApprovals = subscriptions.filter(s => s.status === 'pending')
      const trialUsers = subscriptions.filter(s => s.type === 'TRIAL')
      return { subscriptions, pendingApprovals, trialUsers, meta }
    },
  })
}
