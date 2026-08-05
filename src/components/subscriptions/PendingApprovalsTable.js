'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Check, X, Download, Image as ImageIcon, MoreHorizontal } from 'lucide-react'
import Badge from '@/components/ui/Badge'

function DropdownMenu({ pos, approval, onClose, onView, onApprove, onReject }) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[999]" onClick={onClose} />
      <div
        className="fixed w-48 bg-white rounded-lg border border-slate-200 shadow-xl z-[1000] py-1"
        style={{ top: pos.top, right: pos.right }}
      >
        <button onClick={() => { onClose(); onView(approval); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <Eye size={15} /> View
        </button>
        <button onClick={() => { onClose(); onApprove(approval); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-emerald-700 hover:bg-emerald-50">
          <Check size={15} /> Approve
        </button>
        <button onClick={() => { onClose(); onReject(approval); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50">
          <X size={15} /> Reject
        </button>
        {approval.paymentScreenshot && (
          <a href={approval.paymentScreenshot} download className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Download size={15} /> Download
          </a>
        )}
      </div>
    </>,
    document.body
  )
}

export default function PendingApprovalsTable({ approvals = [], onView, onApprove, onReject }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })

  const handleOpenMenu = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    setOpenMenu(openMenu === id ? null : id)
  }

  const activeApproval = approvals.find(a => a.id === openMenu)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Payment Screenshot</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Seller Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Plan</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Payment Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Requested On</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {approvals.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-400">No pending approvals</td>
              </tr>
            )}
            {approvals.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-12 h-14 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                    <ImageIcon size={18} className="text-slate-400" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-900">{a.sellerName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{a.phone}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{a.plan}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-900">Rs. {a.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{a.paymentDate}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{a.requestedOn}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="pending">Pending</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => handleOpenMenu(e, a.id)}
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

      {activeApproval && (
        <DropdownMenu
          pos={menuPos}
          approval={activeApproval}
          onClose={() => setOpenMenu(null)}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </div>
  )
}
