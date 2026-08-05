'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Edit3, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Image, Loader2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import apiClient from '@/api/axios'

const statusVariant = {
  running: 'running',
  scheduled: 'scheduled',
  draft: 'draft',
  expired: 'expired',
  inactive: 'inactive',
}

function DropdownMenu({ buttonRef, ad, onClose, onView, onEdit, onDelete }) {
  const [pos, setPos] = useState({ top: 0, right: 0 })

  useEffect(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
  }, [buttonRef])

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999]" onClick={onClose} />
      <div
        className="fixed w-44 bg-white rounded-lg border border-slate-200 shadow-xl z-[1000] py-1"
        style={{ top: pos.top, right: pos.right }}
      >
        <button onClick={() => { onClose(); onView(ad); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <Eye size={15} /> View
        </button>
        <button onClick={() => { onClose(); onEdit(ad); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <Edit3 size={15} /> Edit
        </button>
        <div className="border-t border-slate-100 my-1" />
        <button onClick={() => { onClose(); onDelete(ad); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50">
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </>,
    document.body
  )
}

function AdImage({ imageUrl, className = '' }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadImage = async () => {
      if (!imageUrl) {
        if (!cancelled) {
          setLoading(false)
          setError(true)
        }
        return
      }

      try {
        const { data } = await apiClient.get(imageUrl, { responseType: 'blob' })
        if (!cancelled) {
          setBlobUrl(URL.createObjectURL(data))
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    loadImage()

    return () => {
      cancelled = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [imageUrl])

  if (loading) {
    return (
      <div className={`w-12 h-8 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ${className}`}>
        <Loader2 size={16} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  if (error || !blobUrl) {
    return (
      <div className={`w-12 h-8 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ${className}`}>
        <Image size={16} className="text-blue-400" />
      </div>
    )
  }

  return (
    <div className={`w-12 h-8 rounded-md flex items-center justify-center overflow-hidden ${className}`}>
      <img src={blobUrl} alt="" className="w-full h-full object-cover" />
    </div>
  )
}

export default function AdTable({ ads, selected, onToggleSelect, onSelectAll, onView, onEdit, onDelete, page, totalPages, onPageChange, search }) {
  const [openMenu, setOpenMenu] = useState(null)
  const allSelected = ads.length > 0 && selected.length === ads.length
  const buttonRefs = useRef({})

  const getButtonRef = useCallback((id) => {
    if (!buttonRefs.current[id]) buttonRefs.current[id] = { current: null }
    return buttonRefs.current[id]
  }, [])

  const filtered = useMemo(() => {
    if (!search) return ads
    const q = search.toLowerCase()
    return ads.filter(a => a.title.toLowerCase().includes(q))
  }, [ads, search])

  const activeAd = ads.find(a => a.id === openMenu)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {filtered.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">
          No advertisements match your filters.
        </div>
      ) : (
        <>
        <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={e => onSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Banner</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Target App</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Order</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Start Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">End Date</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(ad => (
                  <tr key={ad.id} className={`hover:bg-slate-50 transition-colors ${selected.includes(ad.id) ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.includes(ad.id)}
                        onChange={() => onToggleSelect(ad.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <AdImage imageUrl={ad.image} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-slate-900">{ad.title}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{ad.target}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant[ad.status] || 'default'}>{ad.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm text-slate-600">{ad.order}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{ad.startDate}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-slate-600">{ad.endDate}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        ref={getButtonRef(ad.id)}
                        onClick={() => setOpenMenu(openMenu === ad.id ? null : ad.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {selected.length > 0 ? `${selected.length} selected` : `${filtered.length} advertisements`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {activeAd && (
        <DropdownMenu
          buttonRef={buttonRefs.current[activeAd.id]}
          ad={activeAd}
          onClose={() => setOpenMenu(null)}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}