'use client'

import { useQuery } from '@tanstack/react-query'
import { getAdvertisements } from '@/services/advertisement.service'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1$/, '')

function fmtDate(iso) {
  if (!iso) return ''
  return iso.split('T')[0]
}

function normalizeAd(ad) {
  const targetMap = { SELLER: 'Seller App', CUSTOMER: 'Customer App', BOTH: 'Both Apps' }
  const statusMap = { ACTIVE: 'running', INACTIVE: 'inactive', SCHEDULED: 'scheduled', EXPIRED: 'expired', DRAFT: 'draft' }
  return {
    id: ad._id,
    title: ad.title || '',
    subtitle: ad.subtitle || '',
    description: ad.description || '',
    buttonText: ad.buttonText || '',
    buttonUrl: ad.buttonUrl || '',
    target: targetMap[ad.target] || ad.target || 'Both Apps',
    order: ad.displayOrder || 1,
    status: statusMap[(ad.status || '').toUpperCase()] || (ad.status || '').toLowerCase() || 'draft',
    startDate: fmtDate(ad.startDate),
    endDate: fmtDate(ad.endDate),
    createdAt: fmtDate(ad.createdAt),
    image: ad.bannerImage ? `${API_BASE}${ad.bannerImage}` : null,
    bannerImage: ad.bannerImage || null,
    priority: ad.priority || 'Medium',
  }
}

export function useAdminAdvertisements(params = {}) {
  return useQuery({
    queryKey: ['admin-advertisements', params],
    queryFn: () => getAdvertisements(params),
    select: (res) => {
      const raw = res.data || []
      const ads = raw.map(normalizeAd)
      const meta = res.meta || {}
      return { ads, meta }
    },
  })
}
