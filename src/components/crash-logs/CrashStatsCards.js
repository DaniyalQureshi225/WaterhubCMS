'use client'

import { Bug, AlertOctagon, AlertTriangle, CalendarClock, CalendarRange, Store } from 'lucide-react'

export default function CrashStatsCards({ stats = {}, isLoading }) {
  const cards = [
    { label: 'Total Crashes', value: stats.total || 0, icon: Bug, color: 'bg-slate-50 text-slate-600' },
    { label: 'Fatal', value: stats.fatal || 0, icon: AlertOctagon, color: 'bg-red-50 text-red-600' },
    { label: 'Non-Fatal', value: stats.nonFatal || 0, icon: AlertTriangle, color: 'bg-orange-50 text-orange-600' },
    { label: "Today's Crashes", value: stats.today || 0, icon: CalendarClock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Last 7 Days', value: stats.last7 || 0, icon: CalendarRange, color: 'bg-blue-50 text-blue-600' },
    { label: 'Affected Sellers', value: stats.affectedSellers || 0, icon: Store, color: 'bg-violet-50 text-violet-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.color}`}>
              <card.icon size={18} />
            </div>
          </div>
          <span className="text-xl font-bold text-slate-900">
            {isLoading ? '…' : card.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}
