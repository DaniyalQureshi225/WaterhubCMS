'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Target, Image, Loader2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import apiClient from '@/api/axios'

const statusVariant = {
  running: 'running',
  scheduled: 'scheduled',
  draft: 'draft',
  expired: 'expired',
  inactive: 'inactive',
}

function AdBanner({ imageUrl, title, className = '' }) {
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

  return (
    <div className={`w-full aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ${className}`}>
      {loading && <Loader2 size={40} className="text-blue-400 animate-spin" />}
      {error && <Image size={40} className="text-blue-400" />}
      {blobUrl && <img src={blobUrl} alt={title} className="w-full h-full object-cover" />}
    </div>
  )
}

export default function AdDetailDrawer({ ad, isOpen, onClose }) {
  if (!isOpen || !ad) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Advertisement Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AdBanner imageUrl={ad.image} title={ad.title} />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-900">{ad.title}</h3>
              <Badge variant={statusVariant[ad.status] || 'default'}>{ad.status}</Badge>
            </div>
            {ad.subtitle && (
              <p className="text-sm text-slate-500">{ad.subtitle}</p>
            )}
          </div>

          {ad.description && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
              <p className="text-sm text-slate-700">{ad.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {ad.buttonText && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Button Text</label>
                <p className="text-sm font-medium text-slate-900">{ad.buttonText}</p>
              </div>
            )}
            {ad.buttonUrl && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Button URL</label>
                <p className="text-sm text-blue-600 font-medium">{ad.buttonUrl}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-4 py-3">
            <Target size={16} className="text-slate-400" />
            <span>Target App: <strong>{ad.target}</strong></span>
          </div>

          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
              <p className="text-sm font-medium text-slate-900">{ad.startDate}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
              <p className="text-sm font-medium text-slate-900">{ad.endDate}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Display Order</label>
              <p className="text-sm font-medium text-slate-900">#{ad.order}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}