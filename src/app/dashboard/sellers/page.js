'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, Plus, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { makeSellers, sellerActivity } from '@/components/sellers/data'
import SellerStatsCards from '@/components/sellers/SellerStatsCards'
import SellerFilterBar from '@/components/sellers/SellerFilterBar'
import SellersTable from '@/components/sellers/SellersTable'
import SellerDetailDrawer from '@/components/sellers/SellerDetailDrawer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const sellers = makeSellers()

const growthData = [
  { month: 'Jul', sellers: 520 }, { month: 'Aug', sellers: 548 }, { month: 'Sep', sellers: 575 },
  { month: 'Oct', sellers: 610 }, { month: 'Nov', sellers: 645 }, { month: 'Dec', sellers: 680 },
  { month: 'Jan', sellers: 712 }, { month: 'Feb', sellers: 738 }, { month: 'Mar', sellers: 765 },
  { month: 'Apr', sellers: 790 }, { month: 'May', sellers: 818 }, { month: 'Jun', sellers: 842 },
]

const revenueData = [
  { name: 'Monthly Pro', value: 4800000 }, { name: 'Annual Premium', value: 22320000 },
  { name: 'Trial', value: 0 },
]

const statusData = [
  { status: 'Active', count: sellers.filter(s => s.status === 'active').length },
  { status: 'Pending', count: sellers.filter(s => s.status === 'pending').length },
  { status: 'Suspended', count: sellers.filter(s => s.status === 'suspended').length },
  { status: 'Inactive', count: sellers.filter(s => s.status === 'inactive').length },
]

export default function SellersPage() {
  const [filters, setFilters] = useState({ search: '', status: '', plan: '', dateFrom: '', dateTo: '' })
  const [viewingSeller, setViewingSeller] = useState(null)

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters({ search: '', status: '', plan: '', dateFrom: '', dateTo: '' })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Sellers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Manage Sellers</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all seller accounts, subscriptions, and performance.</p>
        </div>

      </div>

      <SellerStatsCards sellers={sellers} />

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-slate-900">All Sellers</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-5 pt-4 pb-0">
            <SellerFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
          </div>
          <div className="mt-4">
            <SellersTable sellers={sellers} filters={filters} onView={setViewingSeller} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Seller Growth</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                  <Line type="monotone" dataKey="sellers" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, fill: '#2563eb' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Revenue by Plan</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} formatter={v => [`Rs. ${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Seller Status Distribution</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {sellerActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <TrendingUp size={15} className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-900"><span className="font-medium">{a.action}</span> — {a.seller}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SellerDetailDrawer seller={viewingSeller} isOpen={!!viewingSeller} onClose={() => setViewingSeller(null)} />
    </div>
  )
}
