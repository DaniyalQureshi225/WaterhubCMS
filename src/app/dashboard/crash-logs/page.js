'use client'

import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { useCrashLogs, useCrashLogStats } from '@/hooks/useCrashLogs'
import { deleteCrashLog } from '@/services/crash.service'
import CrashStatsCards from '@/components/crash-logs/CrashStatsCards'
import CrashFilterBar from '@/components/crash-logs/CrashFilterBar'
import CrashLogsTable from '@/components/crash-logs/CrashLogsTable'
import CrashDetailDrawer from '@/components/crash-logs/CrashDetailDrawer'

const ITEMS_PER_PAGE = 10

export default function CrashLogsPage() {
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewing, setViewing] = useState(null)

  const apiParams = useMemo(() => {
    const params = {
      page,
      limit: ITEMS_PER_PAGE,
      sortBy,
      sortOrder,
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value
    })
    return params
  }, [page, sortBy, sortOrder, filters])

  const { data, isLoading, isError, refetch } = useCrashLogs(apiParams)
  const statsQuery = useCrashLogStats()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCrashLog(id),
    onSuccess: () => {
      toast.success('Crash log deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-crash-logs'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete crash log')
    },
  })

  const crashes = data?.crashes || []
  const meta = data?.meta || {}
  const totalPages = Math.ceil((meta.total || crashes.length) / ITEMS_PER_PAGE)

  function handleFilterChange(next) {
    setFilters(next)
    setPage(1)
  }

  function handleFilterClear() {
    setFilters({})
    setPage(1)
  }

  function handleSortChange(column) {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder(column === 'sellerName' || column === 'companyName' ? 'asc' : 'desc')
    }
    setPage(1)
  }

  function handleDelete(crash) {
    if (confirm(`Delete crash log from ${crash.sellerName}?`)) {
      deleteMutation.mutate(crash.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Crash Logs</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Crash Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor and investigate Seller App crashes reported by your users.</p>
        </div>
        <button
          onClick={() => { refetch(); statsQuery.refetch(); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {isError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          Failed to load crash logs. Please try again.
        </div>
      )}

      <CrashStatsCards stats={statsQuery.data || {}} isLoading={statsQuery.isLoading} />

      <CrashFilterBar filters={filters} onChange={handleFilterChange} onClear={handleFilterClear} />

      <CrashLogsTable
        crashes={crashes}
        meta={meta}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onView={setViewing}
        onDelete={handleDelete}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />

      <CrashDetailDrawer
        crashId={viewing?.id}
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  )
}
