'use client'

import { Users, UserCheck, UserPlus, UserX, ShoppingBag, DollarSign } from 'lucide-react'

export default function CustomerStatsCards({ customers }) {
  const total = customers.length
  const active = customers.filter(c => c.status === 'active').length
  const newThisMonth = customers.filter(c => c.joinDate >= '2026-06-01').length
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0)
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  const cards = [
    { label: 'Total Customers', value: total, icon: Users, color: 'bg-blue-50 text-blue-600', change: '+6.3%' },
    { label: 'Active Customers', value: active, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600', change: '+4.1%' },
    { label: 'New This Month', value: newThisMonth, icon: UserPlus, color: 'bg-violet-50 text-violet-600', change: '+14.2%' },
    { label: 'Inactive', value: customers.filter(c => c.status === 'inactive').length, icon: UserX, color: 'bg-slate-100 text-slate-600', change: '-2.3%' },
    { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: ShoppingBag, color: 'bg-amber-50 text-amber-600', change: '+9.8%' },
    { label: 'Total Spent', value: `Rs. ${(totalSpent / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-indigo-50 text-indigo-600', change: '+7.5%' },
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
