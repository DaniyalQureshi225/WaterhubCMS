'use client'

import { TrendingUp, TrendingDown, DollarSign, Users, Store, Speaker } from 'lucide-react'

function fmt(n) {
  return `Rs. ${(n || 0).toLocaleString()}`
}

export default function SummaryCards({ data = {} }) {
  const { revenue = {}, subscriptions = {}, users = {}, orders = {}, advertisements = {} } = data

  const cards = [
    { label: 'Daily Revenue', value: fmt(revenue.today), change: revenue.today > revenue.yesterday ? '+higher' : '-lower', up: revenue.today >= (revenue.yesterday || 0), icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
    { label: 'Monthly Revenue', value: fmt(revenue.monthly), change: '', up: true, icon: DollarSign, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Revenue', value: fmt(revenue.total), change: '', up: true, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Subscriptions', value: (subscriptions.active || 0).toString(), change: '', up: true, icon: Users, color: 'bg-violet-50 text-violet-600' },
    { label: 'Total Sellers', value: (users.totalSellers || 0).toString(), change: '', up: true, icon: Store, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Total Customers', value: (users.totalCustomers || 0).toString(), change: '', up: true, icon: Users, color: 'bg-rose-50 text-rose-600' },
    { label: 'Total Orders', value: (orders.total || 0).toString(), change: '', up: true, icon: Speaker, color: 'bg-amber-50 text-amber-600' },
    { label: 'Ad Revenue', value: fmt(advertisements.revenue), change: '', up: true, icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.color}`}>
              <card.icon size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{card.value}</span>
            {card.change && (
              <span className={`text-xs font-medium flex items-center gap-0.5 ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
