'use client'

import { useState } from 'react'
import { ChevronRight, Plus, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { makeCustomers, customerActivity } from '@/components/customers/data'
import CustomerStatsCards from '@/components/customers/CustomerStatsCards'
import CustomerFilterBar from '@/components/customers/CustomerFilterBar'
import CustomersTable from '@/components/customers/CustomersTable'
import CustomerDetailDrawer from '@/components/customers/CustomerDetailDrawer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const customers = makeCustomers()

const growthData = [
  { month: 'Jul', customers: 5800 }, { month: 'Aug', customers: 6120 }, { month: 'Sep', customers: 6450 },
  { month: 'Oct', customers: 6780 }, { month: 'Nov', customers: 7120 }, { month: 'Dec', customers: 7450 },
  { month: 'Jan', customers: 7820 }, { month: 'Feb', customers: 8150 }, { month: 'Mar', customers: 8450 },
  { month: 'Apr', customers: 8680 }, { month: 'May', customers: 8820 }, { month: 'Jun', customers: 8925 },
]

const cityData = [
  { city: 'Lahore', count: customers.filter(c => c.city === 'Lahore').length },
  { city: 'Karachi', count: customers.filter(c => c.city === 'Karachi').length },
  { city: 'Islamabad', count: customers.filter(c => c.city === 'Islamabad').length },
  { city: 'Rawalpindi', count: customers.filter(c => c.city === 'Rawalpindi').length },
  { city: 'Faisalabad', count: customers.filter(c => c.city === 'Faisalabad').length },
]

export default function CustomersPage() {
  const [filters, setFilters] = useState({ search: '', status: '', dateFrom: '', dateTo: '' })
  const [viewingCustomer, setViewingCustomer] = useState(null)

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Customers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Manage Customers</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all customer accounts, orders, and engagement.</p>
        </div>

      </div>

      <CustomerStatsCards customers={customers} />

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-slate-900">All Customers</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-5 pt-4 pb-0">
            <CustomerFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
          </div>
          <div className="mt-4">
            <CustomersTable customers={customers} filters={filters} onView={setViewingCustomer} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Customer Growth</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                  <Line type="monotone" dataKey="customers" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, fill: '#2563eb' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Customers by City</h3>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
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
            {customerActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <TrendingUp size={15} className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-900"><span className="font-medium">{a.action}</span> — {a.customer}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CustomerDetailDrawer customer={viewingCustomer} isOpen={!!viewingCustomer} onClose={() => setViewingCustomer(null)} />
    </div>
  )
}
