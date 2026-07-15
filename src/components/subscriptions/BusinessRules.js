'use client'

import { Info, Calendar, AlertTriangle, Ban, Clock, ShieldCheck } from 'lucide-react'

const rules = [
  { icon: Info, color: 'text-blue-600 bg-blue-50', text: 'Every phone number receives a one-time 7-day free trial only.' },
  { icon: Calendar, color: 'text-emerald-600 bg-emerald-50', text: 'Trial starts immediately after seller registration and cannot be restarted.' },
  { icon: Ban, color: 'text-red-600 bg-red-50', text: 'Seller cannot use the Seller App after trial expires until subscription is approved.' },
  { icon: Calendar, color: 'text-indigo-600 bg-indigo-50', text: 'Monthly subscriptions expire on the same calendar date of the next month (e.g. 15 Mar → 15 Apr, 31 Jan → 28 Feb).' },
  { icon: ShieldCheck, color: 'text-violet-600 bg-violet-50', text: 'Annual subscriptions expire on the same calendar date next year (e.g. 10 Jun 2026 → 10 Jun 2027).' },
  { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', text: '29 Feb expiry adjusts to 28 Feb on non-leap years.' },
]

export default function BusinessRules() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Info size={18} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">Subscription Business Rules</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rules.map((r, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}>
              <r.icon size={16} />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
