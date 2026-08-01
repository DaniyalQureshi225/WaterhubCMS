'use client'

import { useState, useEffect } from 'react'
import { X, Image, Calendar, Clock, User, Send, AlertCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import apiClient from '@/api/axios'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1$/, '')

const statusVariant = {
  sent: 'running',
  scheduled: 'scheduled',
  pending: 'pending',
  failed: 'expired',
  cancelled: 'inactive',
}

export default function NotificationDetailDrawer({ notification, isOpen, onClose }) {
  const [imgBlob, setImgBlob] = useState(null)

  useEffect(() => {
    if (!notification?.image || !isOpen) {
      setImgBlob(null)
      return
    }

    const url = notification.image.startsWith('http') ? notification.image : `${API_BASE}${notification.image}`
    let cancelled = false

    apiClient.get(url, { responseType: 'blob' })
      .then(({ data }) => {
        if (!cancelled) setImgBlob(URL.createObjectURL(data))
      })
      .catch(() => {
        if (!cancelled) setImgBlob(null)
      })

    return () => { cancelled = true }
  }, [notification?.image, isOpen])

  if (!isOpen || !notification) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Notification Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {imgBlob && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <img src={imgBlob} alt="Notification" className="w-full" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-900">{notification.title}</h3>
              <Badge variant={statusVariant[notification.status] || 'default'}>{notification.status}</Badge>
            </div>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{notification.message}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Send size={14} className="text-slate-400" />
                <div>
                  <p className="text-slate-500 text-xs">Audience</p>
                  <p className="font-medium text-slate-900">{notification.audienceLabel}</p>
                </div>
              </div>
              {notification.targetUserLabel && (
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-xs">Target User</p>
                    <p className="font-medium text-slate-900">{notification.targetUserLabel}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <div>
                  <p className="text-slate-500 text-xs">Created</p>
                  <p className="font-medium text-slate-900">{notification.createdAt}</p>
                </div>
              </div>
              {notification.isScheduled && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-xs">Scheduled For</p>
                    <p className="font-medium text-slate-900">{notification.scheduleDate} {notification.scheduleTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User size={14} className="text-slate-400" />
            <span>Created by <strong>{notification.createdBy}</strong></span>
          </div>
        </div>
      </div>
    </>
  )
}
