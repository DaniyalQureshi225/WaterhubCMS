'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'FATAL', label: 'Fatal' },
  { value: 'ERROR', label: 'Non-Fatal' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'INFO', label: 'Info' },
]

export default function CrashFilterBar({ filters = {}, onChange, onClear }) {
  const [search, setSearch] = useState(filters.search || '')
  const [sellerName, setSellerName] = useState(filters.sellerName || '')
  const [company, setCompany] = useState(filters.company || '')
  const [appVersion, setAppVersion] = useState(filters.appVersion || '')
  const [deviceModel, setDeviceModel] = useState(filters.deviceModel || '')
  const [severity, setSeverity] = useState(filters.severity || '')
  const [startDate, setStartDate] = useState(filters.startDate || '')
  const [endDate, setEndDate] = useState(filters.endDate || '')

  const dSearch = useDebouncedValue(search)
  const dSellerName = useDebouncedValue(sellerName)
  const dCompany = useDebouncedValue(company)
  const dAppVersion = useDebouncedValue(appVersion)
  const dDeviceModel = useDebouncedValue(deviceModel)

  const filtersRef = useRef(filters)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    filtersRef.current = filters
    onChangeRef.current = onChange
  })

  useEffect(() => {
    onChangeRef.current({
      ...filtersRef.current,
      search: dSearch || undefined,
      sellerName: dSellerName || undefined,
      company: dCompany || undefined,
      appVersion: dAppVersion || undefined,
      deviceModel: dDeviceModel || undefined,
    })
  }, [dSearch, dSellerName, dCompany, dAppVersion, dDeviceModel])

  function handleSeverity(e) {
    setSeverity(e.target.value)
    onChange({ ...filters, severity: e.target.value || undefined })
  }

  function handleStartDate(e) {
    const value = e.target.value
    setStartDate(value)
    onChange({ ...filters, startDate: value ? new Date(`${value}T00:00:00`).toISOString() : undefined })
  }

  function handleEndDate(e) {
    const value = e.target.value
    setEndDate(value)
    onChange({ ...filters, endDate: value ? new Date(`${value}T23:59:59`).toISOString() : undefined })
  }

  function handleClear() {
    setSearch('')
    setSellerName('')
    setCompany('')
    setAppVersion('')
    setDeviceModel('')
    setSeverity('')
    setStartDate('')
    setEndDate('')
    onClear()
  }

  const hasActive =
    dSearch || dSellerName || dCompany || dAppVersion || dDeviceModel || severity || startDate || endDate

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-900">Filters</span>
        {hasActive && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"
          >
            <X size={13} /> Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Search</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Message, stack trace..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Seller Name</label>
          <input
            type="text"
            value={sellerName}
            onChange={e => setSellerName(e.target.value)}
            placeholder="Daniyal"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Company</label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="AquaPure Water"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Severity</label>
          <select value={severity} onChange={handleSeverity} className={inputClass}>
            {SEVERITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">App Version</label>
          <input
            type="text"
            value={appVersion}
            onChange={e => setAppVersion(e.target.value)}
            placeholder="2.1.0"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Device</label>
          <input
            type="text"
            value={deviceModel}
            onChange={e => setDeviceModel(e.target.value)}
            placeholder="Pixel 8"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">From Date</label>
          <input type="date" value={startDate} onChange={handleStartDate} className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">To Date</label>
          <input type="date" value={endDate} onChange={handleEndDate} className={inputClass} />
        </div>
      </div>
    </div>
  )
}
