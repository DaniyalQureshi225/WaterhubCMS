'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
import Badge from '@/components/ui/Badge'

function SortableTh({ label, column, sortBy, sortOrder, onSort }) {
  const active = sortBy === column
  return (
    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
      <button
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 uppercase tracking-wider hover:text-slate-800 transition-colors ${active ? 'text-blue-600' : ''}`}
      >
        {label}
        {active ? (
          sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <ChevronDown size={12} className="opacity-0 group-hover:opacity-100" />
        )}
      </button>
    </th>
  )
}

function DropdownMenu({ pos, crash, onClose, onView, onDelete }) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[999]" onClick={onClose} />
      <div
        className="fixed w-40 bg-white rounded-lg border border-slate-200 shadow-xl z-[1000] py-1"
        style={{ top: pos.top, right: pos.right }}
      >
        <button onClick={() => { onClose(); onView(crash); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <Eye size={15} /> View
        </button>
        <div className="border-t border-slate-100 my-1" />
        <button onClick={() => { onClose(); onDelete(crash); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50">
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </>,
    document.body
  )
}

export default function CrashLogsTable({
  crashes, meta, page, totalPages, onPageChange, onView, onDelete,
  isLoading, sortBy, sortOrder, onSort,
}) {
  const [openMenu, setOpenMenu] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })

  const handleOpenMenu = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    setOpenMenu(openMenu === id ? null : id)
  }

  const activeCrash = crashes.find(c => c.id === openMenu)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : crashes.length === 0 ? (
        <div className="p-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={24} className="text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No Crash Logs Found</h3>
          <p className="text-sm text-slate-500 mt-1">Adjust your filters or try again later.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <SortableTh label="Seller" column="sellerName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                  <SortableTh label="Company" column="companyName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Message</th>
                  <SortableTh label="Severity" column="severity" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Screen</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">App Version</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Device</th>
                  <SortableTh label="Date" column="createdAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Time</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {crashes.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 max-w-[140px] truncate">{c.sellerName}</span>
                        {c.sellerId && <span className="text-xs text-slate-400 max-w-[140px] truncate">{c.sellerId}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600 max-w-[160px] truncate block">{c.companyName || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600 max-w-[240px] truncate block">{c.message || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={c.severity}>{c.severityLabel}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600 max-w-[120px] truncate block">{c.currentScreen || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{c.appVersion || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600 max-w-[140px] truncate block">{c.deviceModel || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{c.createdAt || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{c.time || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => handleOpenMenu(e, c.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {meta.total ? `${meta.total} crash log${meta.total === 1 ? '' : 's'}` : `${crashes.length} crash logs`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-600 font-medium">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= (totalPages || 1)}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {activeCrash && (
        <DropdownMenu
          pos={menuPos}
          crash={activeCrash}
          onClose={() => setOpenMenu(null)}
          onView={onView}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
