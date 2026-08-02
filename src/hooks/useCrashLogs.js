'use client'

import { useQuery } from '@tanstack/react-query'
import { getCrashLogs } from '@/services/crash.service'

const SEVERITY_MAP = {
  FATAL: 'fatal',
  ERROR: 'nonfatal',
  NON_FATAL: 'nonfatal',
  NONFATAL: 'nonfatal',
  CRASH: 'nonfatal',
  WARNING: 'warning',
  WARN: 'warning',
  INFO: 'info',
  DEBUG: 'info',
  LOG: 'info',
}

const SEVERITY_LABELS = {
  fatal: 'Fatal',
  nonfatal: 'Non-Fatal',
  warning: 'Warning',
  info: 'Info',
}

export function normalizeSeverity(raw) {
  const key = (raw || '').toUpperCase().replace(/\s+/g, '_')
  return SEVERITY_MAP[key] || 'info'
}

export function severityLabel(severity) {
  return SEVERITY_LABELS[severity] || severity
}

function fmtDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function normalizeCrashLog(c) {
  const severity = normalizeSeverity(c.severity)
  return {
    id: c._id,
    sellerId: c.sellerId || '',
    sellerName: c.sellerName || 'Unknown Seller',
    companyName: c.companyName || '',
    appVersion: c.appVersion || '',
    buildNumber: c.buildNumber || '',
    androidVersion: c.androidVersion || '',
    deviceModel: c.deviceModel || '',
    manufacturer: c.manufacturer || '',
    networkType: c.networkType || '',
    currentScreen: c.currentScreen || '',
    message: c.message || '',
    stackTrace: c.stackTrace || '',
    errorType: c.errorType || '',
    severity,
    severityLabel: severityLabel(severity),
    rawSeverity: c.severity,
    createdAt: fmtDateTime(c.createdAt),
    time: fmtTime(c.createdAt),
    isoDate: c.createdAt,
  }
}

export function useCrashLogs(params = {}) {
  return useQuery({
    queryKey: ['admin-crash-logs', params],
    queryFn: () => getCrashLogs(params),
    select: (res) => {
      const raw = res.data || []
      const meta = res.meta || {}
      return { crashes: raw.map(normalizeCrashLog), meta }
    },
  })
}

export function useCrashLogStats() {
  return useQuery({
    queryKey: ['admin-crash-logs-stats'],
    queryFn: () => getCrashLogs({ page: 1, limit: 1000 }),
    select: (res) => {
      const raw = res.data || []
      const total = res.meta?.total || raw.length
      const now = new Date()
      const dayMs = 24 * 60 * 60 * 1000
      let fatal = 0
      let nonFatal = 0
      let today = 0
      let last7 = 0
      const sellers = new Set()

      raw.forEach((c) => {
        const sev = normalizeSeverity(c.severity)
        if (sev === 'fatal') fatal += 1
        if (sev === 'nonfatal') nonFatal += 1
        if (c.sellerName) sellers.add(c.sellerName)

        const d = new Date(c.createdAt)
        if (!isNaN(d)) {
          if (d.toDateString() === now.toDateString()) today += 1
          if (now - d <= dayMs * 7) last7 += 1
        }
      })

      return { total, fatal, nonFatal, today, last7, affectedSellers: sellers.size }
    },
  })
}
