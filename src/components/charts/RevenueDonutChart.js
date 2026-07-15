'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#2563eb', '#f59e0b']

export default function RevenueDonutChart({ data = {} }) {
  const { subscriptions = 0, advertisements = 0 } = data
  const chartData = [
    { name: 'Subscription Revenue', value: subscriptions, color: COLORS[0] },
    { name: 'Advertisement Revenue', value: advertisements, color: COLORS[1] },
  ].filter(d => d.value > 0)

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', value: 1, color: '#e2e8f0' })
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            formatter={v => `Rs. ${(v).toLocaleString()}`}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={v => <span className="text-sm text-slate-700">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
