'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b']

export default function SubscriptionPieChart({ data = {} }) {
  const { monthly = 0, annual = 0, trial = 0 } = data
  const chartData = [
    { name: 'Monthly', value: monthly, color: COLORS[0] },
    { name: 'Annual', value: annual, color: COLORS[1] },
    { name: 'Trial', value: trial, color: COLORS[2] },
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
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            formatter={v => `${v} subscribers`}
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
