'use client'

const variants = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  expired: 'bg-red-50 text-red-700 ring-red-600/20',
  trial: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  monthly: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  annual: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  running: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  scheduled: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  draft: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  inactive: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  fatal: 'bg-red-50 text-red-700 ring-red-600/20',
  nonfatal: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  warning: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  default: 'bg-slate-50 text-slate-700 ring-slate-600/20',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const v = variants[variant] || variants.default
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${v} ${className}`}>
      {children}
    </span>
  )
}
