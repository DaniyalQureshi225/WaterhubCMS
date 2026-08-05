'use client'

import { useState, useEffect } from 'react'
import { X, Store, User, Smartphone, Network, Monitor, FileCode2, Bug, AlertTriangle, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { getCrashLogById } from '@/services/crash.service'
import { normalizeSeverity, severityLabel } from '@/hooks/useCrashLogs'

function fmtFull(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d)) return '-'
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="font-medium text-slate-900 text-sm break-words">{value || '-'}</p>
      </div>
    </div>
  )
}

export default function CrashDetailDrawer({ crashId, isOpen, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [prevKey, setPrevKey] = useState(null)

  const key = isOpen && crashId ? crashId : null

  if (key !== prevKey) {
    setPrevKey(key)
    setData(null)
    setError('')
    setLoading(!!key)
  }

  useEffect(() => {
    if (!key) return
    let cancelled = false

    getCrashLogById(key)
      .then((res) => {
        if (!cancelled) setData(res.data || res)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load crash log.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [key])

  if (!isOpen) return null

  const severity = data ? normalizeSeverity(data.severity) : 'info'

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Crash Log Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <Bug size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{data.sellerName || 'Unknown Seller'}</h3>
                    <Badge variant={severity}>{severityLabel(severity)}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{data.companyName || ''}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <span className="text-sm font-semibold text-slate-800">Error</span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm text-slate-900 break-words">{data.message || '-'}</p>
                  {data.errorType && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {data.errorType}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <FileCode2 size={15} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-800">Stack Trace</span>
                </div>
                <pre className="p-4 text-xs leading-relaxed font-mono bg-slate-900 text-slate-100 overflow-auto max-h-72 whitespace-pre-wrap">
                  {data.stackTrace || 'No stack trace available'}
                </pre>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={User} label="Seller" value={data.sellerName} />
                  <InfoRow icon={Store} label="Company" value={data.companyName} />
                  <InfoRow icon={Store} label="Seller ID" value={data.sellerId} />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Environment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={Monitor} label="App Version" value={data.appVersion} />
                  <InfoRow icon={Monitor} label="Build Number" value={data.buildNumber} />
                  <InfoRow icon={Smartphone} label="Device" value={data.deviceModel} />
                  <InfoRow icon={Smartphone} label="Manufacturer" value={data.manufacturer} />
                  <InfoRow icon={Smartphone} label="Android Version" value={data.androidVersion} />
                  <InfoRow icon={Network} label="Network" value={data.networkType} />
                  <InfoRow icon={Monitor} label="Screen" value={data.currentScreen} />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={Clock} label="Reported At" value={fmtFull(data.createdAt)} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
