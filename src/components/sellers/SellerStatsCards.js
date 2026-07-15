'use client'

import { Store, CheckCircle, Clock, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'

export default function SellerStatsCards({ sellers }) {
  const total = sellers.length
  const active = sellers.filter(s => s.status === 'active').length
  const pending = sellers.filter(s => s.status === 'pending').length
  const suspended = sellers.filter(s => s.status === 'suspended').length
  const newThisMonth = sellers.filter(s => s.joinDate >= '2026-06-01').length
  const totalRevenue = sellers.reduce((sum, s) => sum + s.revenue, 0)

  const cards = [
    { label: 'Total Sellers', value: total, icon: Store, color: 'bg-blue-50 text-blue-600', change: '+5.2%' },
    { label: 'Active Sellers', value: active, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', change: '+3.8%' },
    { label: 'Pending Approval', value: pending, icon: Clock, color: 'bg-amber-50 text-amber-600', change: '-1.2%' },
    { label: 'Suspended', value: suspended, icon: AlertTriangle, color: 'bg-red-50 text-red-600', change: '+0.5%' },
    { label: 'New This Month', value: newThisMonth, icon: TrendingUp, color: 'bg-violet-50 text-violet-600', change: '+12.4%' },
    { label: 'Total Revenue', value: `Rs. ${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'bg-indigo-50 text-indigo-600', change: '+8.7%' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon size={16} />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{card.value}</p>
          <span className="text-xs font-medium text-emerald-600">{card.change} vs last month</span>
        </div>
      ))}
    </div>
  )
}
