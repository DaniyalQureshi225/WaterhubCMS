'use client'

import { CreditCard } from 'lucide-react'

export default function EmptyState({ onCreate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <CreditCard size={30} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No Subscriptions Found</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Create your first subscription plan to get started with seller subscriptions.
        </p>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
        >
          <CreditCard size={16} />
          Create Subscription
        </button>
      </div>
    </div>
  )
}
