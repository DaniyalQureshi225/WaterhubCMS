'use client'

import { Store, CreditCard, Check, UserPlus, Speaker, Package, Clock } from 'lucide-react'

const TYPE_MAP = {
  SELLER_REGISTERED: { icon: Store, color: 'text-blue-600 bg-blue-50' },
  ORDER_DELIVERED: { icon: Package, color: 'text-emerald-600 bg-emerald-50' },
  SUBSCRIPTION_PURCHASED: { icon: CreditCard, color: 'text-violet-600 bg-violet-50' },
  CUSTOMER_REGISTERED: { icon: UserPlus, color: 'text-indigo-600 bg-indigo-50' },
  AD_PUBLISHED: { icon: Speaker, color: 'text-amber-600 bg-amber-50' },
  SUBSCRIPTION_APPROVED: { icon: Check, color: 'text-emerald-600 bg-emerald-50' },
  SUBSCRIPTION_RENEWED: { icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
  DEFAULT: { icon: Clock, color: 'text-slate-600 bg-slate-100' },
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const d = new Date(dateStr)
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export default function RecentActivity({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-sm text-slate-400">
        No recent activity
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {activities.slice(0, 7).map((item, idx) => {
        const type = TYPE_MAP[item.type] || TYPE_MAP.DEFAULT
        return (
          <div key={item._id || idx} className="flex gap-3.5 px-5 py-3.5 last:pb-4">
            <div className="relative flex flex-col items-center">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${type.color}`}>
                <type.icon size={16} />
              </div>
              {idx < Math.min(activities.length, 7) - 1 && (
                <div className="w-px flex-1 bg-slate-200 mt-1.5" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-medium text-slate-900">{item.message}</p>
              <p className="text-xs text-slate-400 mt-0.5">{timeAgo(item.date)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
