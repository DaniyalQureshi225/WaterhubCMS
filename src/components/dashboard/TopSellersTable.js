'use client'

import { Search, Eye, MoreHorizontal } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const statusVariant = { active: 'active', approved: 'approved', pending: 'pending' }
const subVariant = { ANNUAL: 'annual', MONTHLY: 'monthly', FREE: 'trial', TRIAL: 'trial' }

function statusFromSubscription(sub) {
  if (!sub) return 'pending'
  const s = sub.toUpperCase()
  if (s === 'ANNUAL') return 'active'
  if (s === 'MONTHLY') return 'active'
  if (s === 'FREE' || s === 'TRIAL') return 'trial'
  return 'pending'
}

export default function TopSellersTable({ sellers = [] }) {
  return (
    <div>
      <div className="px-5 py-3 border-b border-slate-100">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sellers..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Seller Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Orders</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Customers</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Revenue</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Subscription</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sellers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-400">No sellers found</td>
              </tr>
            )}
            {sellers.map(s => (
              <tr key={s._id || s.sellerName} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-slate-900">{s.sellerName || s.shopName}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600">{(s.orders || 0).toLocaleString()}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600">{(s.customers || 0).toLocaleString()}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-slate-900">Rs. {(s.revenue || 0).toLocaleString()}</span>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={subVariant[s.subscription?.toUpperCase()] || 'active'}>{s.subscription || 'N/A'}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[statusFromSubscription(s.subscription)] || 'active'}>
                    {statusFromSubscription(s.subscription)}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Eye size={15} />
                  </button>
                  <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-0.5">
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
