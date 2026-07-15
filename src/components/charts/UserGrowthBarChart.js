'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function UserGrowthBarChart({ sellerGrowth = [], customerGrowth = [] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const chartData = months.map((month, idx) => {
    const s = sellerGrowth.find(d => d.month === month)
    const c = customerGrowth.find(d => d.month === month)
    return {
      month,
      sellers: s?.count || 0,
      customers: c?.count || 0,
    }
  })

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '13px' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={v => <span className="text-sm text-slate-700">{v}</span>}
          />
          <Bar dataKey="sellers" name="Seller Accounts" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={8} />
          <Bar dataKey="customers" name="Customer Accounts" fill="#93c5fd" radius={[3, 3, 0, 0]} maxBarSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
