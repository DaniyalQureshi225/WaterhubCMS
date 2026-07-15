'use client'

import { Search, RotateCcw } from 'lucide-react'

const statuses = ['All', 'Running', 'Scheduled', 'Draft', 'Expired']
const targets = ['All', 'Seller App', 'Customer App', 'Both Apps']

export default function AdFilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search advertisements..."
            value={filters.search}
            onChange={e => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={filters.status}
          onChange={e => onFilterChange('status', e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {statuses.map(s => (
            <option key={s} value={s === 'All' ? '' : s.toLowerCase()}>{s}</option>
          ))}
        </select>

        <select
          value={filters.target}
          onChange={e => onFilterChange('target', e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {targets.map(t => (
            <option key={t} value={t === 'All' ? '' : t}>{t}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => onFilterChange('dateFrom', e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={e => onFilterChange('dateTo', e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  )
}
