'use client'

import { useMemo } from 'react'
import { Info, Calendar, AlertTriangle, Ban, Clock, ShieldCheck, Users, DollarSign, TrendingUp } from 'lucide-react'
import { useSubscriptionAnalytics } from '@/hooks/useSubscriptionAnalytics'

export default function BusinessRules({ subscriptions = [], trialUsers = [], plans = [] }) {
  const analytics = useSubscriptionAnalytics(subscriptions, trialUsers, plans)

  const rules = useMemo(() => [
    { icon: Users, color: 'text-blue-600 bg-blue-50', text: `Trial Duration: ${analytics.trialDuration}` },
    { icon: Calendar, color: 'text-emerald-600 bg-emerald-50', text: `Monthly Subscribers: ${analytics.monthlySubscribers}` },
    { icon: Calendar, color: 'text-violet-600 bg-violet-50', text: `Annual Subscribers: ${analytics.annualSubscribers}` },
    { icon: ShieldCheck, color: 'text-violet-600 bg-violet-50', text: `Active Plans: ${analytics.activePlans}` },
    { icon: DollarSign, color: 'text-amber-600 bg-amber-50', text: `Avg Revenue/Subscriber: Rs. ${analytics.averageRevenuePerSubscriber.toLocaleString()}` },
    { icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50', text: `Avg Subscription Duration: ${analytics.averageSubscriptionDuration} days` },
    { icon: Clock, color: 'text-red-600 bg-red-50', text: `Upcoming Renewals (7d): ${analytics.upcomingRenewals}` },
    { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', text: `Upcoming Expirations (7d): ${analytics.upcomingExpirations}` },
  ], [analytics])

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Info size={18} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">Subscription Business Rules</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rules.map((r, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}>
              <r.icon size={16} />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}