'use client'

import { Search, Eye, MoreHorizontal } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const statusVariant = { active: 'active', approved: 'approved', trial: 'trial', expired: 'expired' }

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return dateStr.split('T')[0]
}

export default function RecentSubscriptions({ subscriptions = [] }) {
  return (
    <div>
      <div className="px-5 py-3 border-b border-slate-100">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Seller</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Plan</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Start Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No subscriptions found</td>
              </tr>
            )}
            {subscriptions.map(s => (
              <tr key={s._id || s.sellerName} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-slate-900">{s.shopName || s.sellerName || 'N/A'}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600">{s.plan || s.subscription || 'N/A'}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-slate-900">Rs. {(s.amount || 0).toLocaleString()}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-slate-600">{formatDate(s.createdAt || s.startDate)}</span>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[s.status] || s.status}>{s.status || 'N/A'}</Badge>
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
