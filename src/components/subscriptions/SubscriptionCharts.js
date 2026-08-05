'use client'

import { useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useSubscriptionAnalytics } from '@/hooks/useSubscriptionAnalytics'

function fmtMonth(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
}

export default function SubscriptionCharts({ subscriptions = [], plans = [] }) {
  const analytics = useSubscriptionAnalytics(subscriptions, [], plans)

  const growthData = useMemo(() => {
    const monthlyMap = new Map()
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      monthlyMap.set(key, 0)
    }
    subscriptions.forEach(s => {
      if (!s.startDate) return
      const d = new Date(s.startDate)
      if (isNaN(d.getTime())) return
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1)
    })
    return Array.from(monthlyMap.entries()).map(([month, subs]) => ({ month, subs }))
  }, [subscriptions])

  const donutData = useMemo(() => {
    const monthly = analytics.monthlySubscribers || 0
    const annual = analytics.annualSubscribers || 0
    return [
      { name: 'Monthly', value: monthly, color: '#2563eb' },
      { name: 'Annual', value: annual, color: '#7c3aed' },
    ].filter(d => d.value > 0)
  }, [analytics.monthlySubscribers, analytics.annualSubscribers])

  const revenueData = useMemo(() => {
    const monthly = analytics.monthlyRevenue || 0
    const annual = analytics.annualRevenue || 0
    return [
      { plan: 'Monthly', revenue: monthly, color: '#2563eb' },
      { plan: 'Annual', revenue: annual, color: '#7c3aed' },
    ].filter(d => d.revenue > 0)
  }, [analytics.monthlyRevenue, analytics.annualRevenue])

  const conversionData = useMemo(() => {
    const monthlyMap = new Map()
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      monthlyMap.set(key, { trials: 0, converted: 0 })
    }
    subscriptions.forEach(s => {
      if (!s.startDate) return
      const d = new Date(s.startDate)
      if (isNaN(d.getTime())) return
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
      const entry = monthlyMap.get(key)
      if (entry) {
        if (s.plan === 'MONTHLY' || s.plan === 'ANNUAL') entry.converted++
        else if (s.type === 'TRIAL') entry.trials++
      }
    })
    return Array.from(monthlyMap.entries()).map(([month, { trials, converted }]) => ({
      month,
      rate: trials > 0 ? Math.round((converted / (trials + converted)) * 100) : 0,
    }))
  }, [subscriptions])

  const hasData = subscriptions.length > 0

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-center h-[280px]">
          <p className="text-slate-500 text-center">No analytics available yet</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-center h-[280px]">
          <p className="text-slate-500 text-center">No analytics available yet</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-center h-[280px]">
          <p className="text-slate-500 text-center">No analytics available yet</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-center h-[280px]">
          <p className="text-slate-500 text-center">No analytics available yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Subscription Growth</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Line type="monotone" dataKey="subs" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, fill: '#2563eb' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly vs Annual</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Legend verticalAlign="bottom" height={30} formatter={v => <span className="text-xs text-slate-700">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue by Plan</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="plan" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `Rs.${(v/1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} formatter={v => [`Rs. ${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {revenueData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Trial Conversion Rate</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} formatter={v => [`${v}%`, 'Conversion Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: '#7c3aed' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}