'use client'

import { Megaphone, PlayCircle, Clock, Archive } from 'lucide-react'

export default function AdStatsCards({ ads }) {
  const total = ads.length
  const running = ads.filter(a => a.status === 'running').length
  const scheduled = ads.filter(a => a.status === 'scheduled').length
  const expired = ads.filter(a => a.status === 'expired').length

  const cards = [
    { label: 'Total Advertisements', value: total, icon: Megaphone, color: 'bg-blue-50 text-blue-600' },
    { label: 'Running', value: running, icon: PlayCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Scheduled', value: scheduled, icon: Clock, color: 'bg-violet-50 text-violet-600' },
    { label: 'Expired', value: expired, icon: Archive, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
            <card.icon size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
