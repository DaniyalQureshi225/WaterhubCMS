'use client'

import { X, Calendar } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const badgeMap = {
  active: 'active', trial: 'trial', expired: 'expired',
  pending: 'pending', rejected: 'rejected', cancelled: 'cancelled',
}

export default function SubDetailsDrawer({ sub, isOpen, onClose, onRenew }) {
  if (!isOpen || !sub) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Subscription Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{sub.sellerName}</h3>
                <Badge variant={badgeMap[sub.status] || 'default'}>{sub.status}</Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{sub.email}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Shop Name</span><p className="font-medium text-slate-900">{sub.shopName}</p></div>
              <div><span className="text-slate-500">Phone</span><p className="font-medium text-slate-900">{sub.phone}</p></div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Subscription Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Calendar size={15} className="text-blue-600" /></div>
                <div><p className="text-sm font-medium text-slate-900">Started</p><p className="text-xs text-slate-500">{sub.startDate}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Calendar size={15} className="text-amber-600" /></div>
                <div><p className="text-sm font-medium text-slate-900">Expires</p><p className="text-xs text-slate-500">{sub.expiryDate} ({sub.daysRemaining} days remaining)</p></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Plan</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">{sub.plan}</span>
              <span className="text-sm font-bold text-slate-900">Rs. {sub.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {sub.status !== 'active' && sub.status !== 'expired' && (
          <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
            <button
              onClick={() => { onRenew(sub); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-600/25 transition-all duration-200"
            >
              Renew Subscription
            </button>
          </div>
        )}
      </div>
    </>
  )
}
