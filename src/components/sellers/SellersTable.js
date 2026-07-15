'use client'

import { useState, useMemo } from 'react'
import { Eye, MoreHorizontal, ChevronLeft, ChevronRight, Store } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const badgeMap = { active: 'active', pending: 'pending', suspended: 'inactive', inactive: 'draft' }
const ITEMS_PER_PAGE = 10

export default function SellersTable({ sellers, filters, onView }) {
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState(null)

  const filtered = useMemo(() => sellers.filter(s => {
    const q = filters.search?.toLowerCase()
    if (q && !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false
    if (filters.status && s.status !== filters.status) return false
    if (filters.plan && s.plan !== filters.plan) return false
    if (filters.dateFrom && s.joinDate < filters.dateFrom) return false
    if (filters.dateTo && s.joinDate > filters.dateTo) return false
    return true
  }), [sellers, filters])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

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
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Orders</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Customers</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Revenue</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Joined</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky top-0 bg-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Store size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{s.phone}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{s.plan}</span></td>
                <td className="px-4 py-3.5"><Badge variant={badgeMap[s.status] || 'default'}>{s.status}</Badge></td>
                <td className="px-4 py-3.5 text-right"><span className="text-sm font-medium text-slate-900">{s.orders.toLocaleString()}</span></td>
                <td className="px-4 py-3.5 text-right"><span className="text-sm text-slate-600">{s.customers.toLocaleString()}</span></td>
                <td className="px-4 py-3.5 text-right"><span className="text-sm font-medium text-slate-900">Rs. {s.revenue.toLocaleString()}</span></td>
                <td className="px-4 py-3.5"><span className="text-sm text-slate-600">{s.joinDate}</span></td>
                <td className="px-4 py-3.5 text-right relative">
                  <button onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
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
        <span className="text-xs text-slate-500">{filtered.length} sellers</span>
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
