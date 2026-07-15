'use client'

import { useState, useMemo } from 'react'
import { Eye, MoreHorizontal, ChevronLeft, ChevronRight, User } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const badgeMap = { active: 'active', suspended: 'inactive', inactive: 'draft' }
const ITEMS_PER_PAGE = 10

export default function CustomersTable({ customers, filters, onView }) {
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState(null)

  const filtered = useMemo(() => customers.filter(c => {
    const q = filters.search?.toLowerCase()
    if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
    if (filters.status && c.status !== filters.status) return false
    if (filters.dateFrom && c.joinDate < filters.dateFrom) return false
    if (filters.dateTo && c.joinDate > filters.dateTo) return false
    return true
  }), [customers, filters])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Customer</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Orders</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Total Spent</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Last Order</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Seller</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">City</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <User size={15} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{c.phone}</span></td>
                <td className="px-4 py-3.5"><Badge variant={badgeMap[c.status] || 'default'}>{c.status}</Badge></td>
                <td className="px-4 py-3.5 text-right"><span className="text-sm font-medium text-slate-900">{c.orders.toLocaleString()}</span></td>
                <td className="px-4 py-3.5 text-right"><span className="text-sm font-medium text-slate-900">Rs. {c.totalSpent.toLocaleString()}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{c.lastOrder}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{c.seller}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{c.city}</span></td>
                <td className="px-4 py-3.5 text-right relative">
                  <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenu === c.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-full mt-0.5 w-40 bg-white rounded-lg border border-slate-200 shadow-xl z-20 py-1">
                        <button onClick={() => { setOpenMenu(null); onView(c); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
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
        <span className="text-xs text-slate-500">{filtered.length} customers</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-600 font-medium">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
