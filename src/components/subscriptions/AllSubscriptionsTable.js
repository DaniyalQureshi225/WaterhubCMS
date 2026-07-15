'use client'

import { useState } from 'react'
import { Eye, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const badgeMap = {
  active: 'active',
  trial: 'trial',
  expired: 'expired',
  pending: 'pending',
  rejected: 'rejected',
  cancelled: 'cancelled',
  approved: 'approved',
}

export default function AllSubscriptionsTable({ subscriptions = [], meta = {}, page, onPageChange, onView }) {
  const [openMenu, setOpenMenu] = useState(null)
  const totalPages = meta.totalPages || 1
  const total = meta.total || subscriptions.length

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Seller</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Plan</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Start Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Expiry Date</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Days Left</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Amount</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Auto Renew</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-400">No subscriptions found</td>
              </tr>
            )}
            {subscriptions.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-slate-900">{s.sellerName}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-600">{s.phone}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-600">{s.plan}</span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={badgeMap[s.status] || 'default'}>{s.status}</Badge>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-600">{s.startDate}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-600">{s.expiryDate}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {s.status === 'active' ? (
                    <span className={`text-sm font-medium ${s.daysRemaining <= 7 ? 'text-red-600' : s.daysRemaining <= 30 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {s.daysRemaining}d
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-slate-900">Rs. {s.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {s.autoRenewal ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">On</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Off</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenu === s.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-full mt-0.5 w-40 bg-white rounded-lg border border-slate-200 shadow-xl z-20 py-1">
                        <button onClick={() => { setOpenMenu(null); onView(s); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <Eye size={15} /> View Details
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-500">{total} subscriptions</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-600 font-medium">Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
