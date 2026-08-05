'use client'

import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, ChevronRight, Play, Pause, Trash2, X } from 'lucide-react'
import AdStatsCards from '@/components/advertisements/AdStatsCards'
import AdFilterBar from '@/components/advertisements/AdFilterBar'
import AdTable from '@/components/advertisements/AdTable'
import CreateAdDrawer from '@/components/advertisements/CreateAdDrawer'
import AdDetailDrawer from '@/components/advertisements/AdDetailDrawer'
import EmptyState from '@/components/advertisements/EmptyState'
import { useAdminAdvertisements } from '@/hooks/useAdminAdvertisements'
import { createAdvertisement, updateAdvertisement, deleteAdvertisement } from '@/services/advertisement.service'

const ITEMS_PER_PAGE = 6

export default function AdvertisementsPage() {
  const [selected, setSelected] = useState([])
  const [filters, setFilters] = useState({ search: '', status: '', target: '', dateFrom: '', dateTo: '' })
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const [viewingAd, setViewingAd] = useState(null)

  const apiParams = useMemo(() => ({
    page,
    limit: ITEMS_PER_PAGE,
    search: filters.search || undefined,
    status: filters.status || undefined,
    target: filters.target || undefined,
  }), [page, filters])

  const { data, isLoading, isError } = useAdminAdvertisements(apiParams)
  const queryClient = useQueryClient()
  const ads = useMemo(() => data?.ads || [], [data])

  const createMutation = useMutation({
    mutationFn: (formData) => createAdvertisement(formData),
    onSuccess: () => {
      toast.success('Advertisement created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] })
      setDrawerOpen(false)
      setEditingAd(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create advertisement')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateAdvertisement(id, formData),
    onSuccess: () => {
      toast.success('Advertisement updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] })
      setDrawerOpen(false)
      setEditingAd(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update advertisement')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdvertisement(id),
    onSuccess: () => {
      toast.success('Advertisement deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-advertisements'] })
      setSelected(prev => prev.filter(i => i !== viewingAd?.id))
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete advertisement')
    },
  })

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      if (filters.search && !ad.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.status && ad.status !== filters.status) return false
      if (filters.target && ad.target !== filters.target) return false
      if (filters.dateFrom && ad.startDate < filters.dateFrom) return false
      if (filters.dateTo && ad.endDate > filters.dateTo) return false
      return true
    })
  }, [ads, filters])

  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE)
  const paginatedAds = filteredAds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  function handleReset() {
    setFilters({ search: '', status: '', target: '', dateFrom: '', dateTo: '' })
    setPage(1)
  }

  function handleToggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function handleSelectAll(checked) {
    setSelected(checked ? paginatedAds.map(a => a.id) : [])
  }

  function handleCreate() {
    setEditingAd(null)
    setDrawerOpen(true)
  }

  function handleEdit(ad) {
    setEditingAd(ad)
    setDrawerOpen(true)
  }

  function handleView(ad) {
    setViewingAd(ad)
    setDetailOpen(true)
  }

  function handleDelete(ad) {
    if (confirm(`Are you sure you want to delete "${ad.title}"?`)) {
      deleteMutation.mutate(ad.id)
    }
  }

  function handleBulkDelete() {
    if (!confirm(`Delete ${selected.length} selected advertisements?`)) return
    selected.forEach(id => deleteMutation.mutate(id))
    setSelected([])
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Advertisements</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Manage Advertisements</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage promotional banners displayed inside the mobile applications.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 flex-shrink-0"
        >
          <Plus size={16} />
          Create Advertisement
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-sm text-red-600">Failed to load advertisements.</p>
        </div>
      ) : (
        <>
          <AdStatsCards ads={ads} />

          <AdFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

          {selected.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-sm text-blue-700 font-medium">{selected.length} selected</span>
              <div className="flex gap-2 ml-auto">
                <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
                <button onClick={() => setSelected([])} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors">
                  <X size={12} /> Clear
                </button>
              </div>
            </div>
          )}

          {ads.length === 0 ? (
            <EmptyState onCreate={handleCreate} />
          ) : (
            <AdTable
              ads={paginatedAds}
              selected={selected}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              search={filters.search}
            />
          )}
        </>
      )}

      <CreateAdDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingAd(null) }}
        mutation={editingAd ? updateMutation : createMutation}
        editAd={editingAd}
      />

      <AdDetailDrawer
        ad={viewingAd}
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setViewingAd(null) }}
      />
    </div>
  )
}
