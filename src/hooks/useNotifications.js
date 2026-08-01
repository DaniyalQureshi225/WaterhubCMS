'use client'

import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '@/services/notification.service'

function fmtDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function normalizeNotification(n) {
  const audienceMap = { ALL: 'All Users', SELLERS: 'All Sellers', CUSTOMERS: 'All Customers', SPECIFIC_USER: 'Specific User' }
  const statusMap = {
    SCHEDULED: 'scheduled',
    SENT: 'sent',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
  }
  return {
    id: n._id,
    title: n.title || '',
    message: n.message || '',
    audience: n.audience || 'ALL',
    audienceLabel: audienceMap[n.audience] || n.audience || 'All Users',
    targetUser: n.targetUser || null,
    targetUserLabel: n.targetUser?.name || n.targetUser?.phone || n.targetUser?.email || (typeof n.targetUser === 'string' ? n.targetUser : ''),
    image: n.image || null,
    scheduleAt: n.scheduleAt || null,
    scheduleDate: fmtDateTime(n.scheduleAt),
    scheduleTime: fmtTime(n.scheduleAt),
    isScheduled: !!n.scheduleAt,
    status: statusMap[(n.status || '').toUpperCase()] || (n.status || '').toLowerCase() || 'sent',
    createdAt: fmtDateTime(n.createdAt),
    createdBy: n.createdBy?.name || n.createdBy || 'Admin',
  }
}

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ['admin-notifications', params],
    queryFn: () => getNotifications(params),
    select: (res) => {
      const raw = res.data || []
      const meta = res.meta || {}
      const notifications = raw.map(normalizeNotification)
      return { notifications, meta }
    },
  })
}
