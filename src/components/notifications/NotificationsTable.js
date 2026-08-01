'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const statusVariant = {
  sent: 'running',
  scheduled: 'scheduled',
  pending: 'pending',
  failed: 'expired',
  cancelled: 'inactive',
}

function DropdownMenu({ buttonRef, notification, onClose, onView, onDelete }) {
  const [pos, setPos] = useState({ top: 0, right: 0 })

  useEffect(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
  }, [buttonRef])

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999]" onClick={onClose} />
      <div
        className="fixed w-40 bg-white rounded-lg border border-slate-200 shadow-xl z-[1000] py-1"
        style={{ top: pos.top, right: pos.right }}
      >
        <button onClick={() => { onClose(); onView(notification); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <Eye size={15} /> View
        </button>
        <div className="border-t border-slate-100 my-1" />
        <button onClick={() => { onClose(); onDelete(notification); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50">
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </>,
    document.body
  )
}

export default function NotificationsTable({ notifications, meta, page, totalPages, onPageChange, onView, onDelete, onRefresh, isLoading }) {
  const [openMenu, setOpenMenu] = useState(null)
  const buttonRefs = useRef({})

  function getButtonRef(id) {
    if (!buttonRefs.current[id]) buttonRefs.current[id] = { current: null }
    return buttonRefs.current[id]
  }

  const activeNotification = notifications.find(n => n.id === openMenu)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-16 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={24} className="text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No Notifications Yet</h3>
          <p className="text-sm text-slate-500 mt-1">Send your first notification to get started.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Message</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Audience</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Target User</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Scheduled</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Created</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Created By</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {notifications.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-slate-900 max-w-[180px] truncate block">{n.title}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600 max-w-[220px] truncate block">{n.message}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{n.audienceLabel}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{n.targetUserLabel || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {n.isScheduled ? (
                        <div className="text-sm text-slate-600">
                          <span>{n.scheduleDate}</span>
                          <span className="text-slate-400 ml-1">{n.scheduleTime}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Immediate</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant[n.status] || 'default'}>{n.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{n.createdAt}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{n.createdBy}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        ref={el => { getButtonRef(n.id).current = el }}
                        onClick={() => setOpenMenu(openMenu === n.id ? null : n.id)}
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
              {meta.total ? `${meta.total} notifications` : `${notifications.length} notifications`}
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

      {activeNotification && (
        <DropdownMenu
          buttonRef={getButtonRef(activeNotification.id)}
          notification={activeNotification}
          onClose={() => setOpenMenu(null)}
          onView={onView}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
