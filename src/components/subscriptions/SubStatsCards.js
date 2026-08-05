'use client'

import { CheckCircle, Users, Clock, AlertTriangle, Calendar, Star, TrendingUp, DollarSign, RotateCcw, XCircle } from 'lucide-react'

export default function SubStatsCards({ stats = {} }) {
  const {
    activeSubscriptions = 0,
    trialUsers = 0,
    expiredSubscriptions = 0,
    pendingApprovals = 0,
    monthlySubscribers = 0,
    annualSubscribers = 0,
    monthlyRevenue = 0,
    annualRevenue = 0,
    totalRevenue = 0,
    expiringSoon = 0,
    paidUsers = 0,
    trialConversionRate = null,
  } = stats

  const cards = [
    { label: 'Active Subscriptions', value: activeSubscriptions, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Trial Users', value: trialUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Paid Users', value: paidUsers, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Monthly Subscribers', value: monthlySubscribers, icon: Calendar, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Annual Subscribers', value: annualSubscribers, icon: Star, color: 'bg-violet-50 text-violet-600' },
    { label: 'Expired Subscriptions', value: expiredSubscriptions, icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Expiring Soon (7d)', value: expiringSoon, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Approval', value: pendingApprovals, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
    { label: 'Monthly Revenue', value: `Rs. ${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Annual Revenue', value: `Rs. ${annualRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Trial Conversion', value: trialConversionRate || 'N/A', icon: RotateCcw, color: 'bg-violet-50 text-violet-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${card.color}`}>
              <card.icon size={16} />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}