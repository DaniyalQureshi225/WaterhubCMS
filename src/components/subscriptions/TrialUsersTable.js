'use client'

import { useState } from 'react'
import { Eye, Repeat, XCircle, MoreHorizontal } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function TrialUsersTable({ trials = [], onView, onConvert, onExpire }) {
  const [openMenu, setOpenMenu] = useState(null)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Seller</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Trial Start</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Trial Ends</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Remaining</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {trials.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No trial users</td>
              </tr>
            )}
            {trials.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-slate-900">{t.sellerName}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-600">{t.phone}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-slate-600">{t.startDate}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm ${t.daysRemaining <= 2 && t.status !== 'expired' ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                    {t.expiryDate}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {t.status === 'expired' ? (
                    <span className="text-xs text-slate-400">Expired</span>
                  ) : (
                    <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.daysRemaining <= 2 ? 'bg-red-50 text-red-700' : t.daysRemaining <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {t.daysRemaining}d
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={t.status === 'expired' ? 'expired' : t.status === 'expiring' ? 'pending' : 'trial'}>
                    {t.status === 'expired' ? 'Expired' : t.status === 'expiring' ? 'Expiring' : 'Active'}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-right relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenu === t.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-full mt-0.5 w-48 bg-white rounded-lg border border-slate-200 shadow-xl z-20 py-1">
                        <button onClick={() => { setOpenMenu(null); onView(t); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <Eye size={15} /> View
                        </button>
                        <button onClick={() => { setOpenMenu(null); onConvert(t); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-emerald-700 hover:bg-emerald-50">
                          <Repeat size={15} /> Convert to Paid
                        </button>
                        <button onClick={() => { setOpenMenu(null); onExpire(t); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50">
                          <XCircle size={15} /> Expire Trial
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
    </div>
  )
}
