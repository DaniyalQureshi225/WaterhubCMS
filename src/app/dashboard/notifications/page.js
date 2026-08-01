'use client'

import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, ChevronRight, RefreshCw } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { createNotification, deleteNotification } from '@/services/notification.service'
import NotificationsTable from '@/components/notifications/NotificationsTable'
import CreateNotificationModal from '@/components/notifications/CreateNotificationModal'
import NotificationDetailDrawer from '@/components/notifications/NotificationDetailDrawer'

const ITEMS_PER_PAGE = 10

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [viewingNotif, setViewingNotif] = useState(null)

  const apiParams = useMemo(() => ({
    page,
    limit: ITEMS_PER_PAGE,
  }), [page])

  const { data, isLoading, isError, refetch } = useNotifications(apiParams)
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (formData) => createNotification(formData),
    onSuccess: () => {
      toast.success('Notification sent successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      setShowCreate(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send notification')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: () => {
      toast.success('Notification deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete notification')
    },
  })

  const notifications = data?.notifications || []
  const meta = data?.meta || {}
  const totalPages = Math.ceil((meta.total || notifications.length) / ITEMS_PER_PAGE)

  function handleDelete(notif) {
    if (confirm(`Delete "${notif.title}"?`)) {
      deleteMutation.mutate(notif.id)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Notifications</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Manage Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Send and schedule push notifications to users, sellers, and customers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
          >
            <Plus size={16} />
            Send Notification
          </button>
        </div>
      </div>

      <NotificationsTable
        notifications={notifications}
        meta={meta}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onView={setViewingNotif}
        onDelete={handleDelete}
        onRefresh={refetch}
        isLoading={isLoading}
      />

      <CreateNotificationModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        mutation={createMutation}
      />

      <NotificationDetailDrawer
        notification={viewingNotif}
        isOpen={!!viewingNotif}
        onClose={() => setViewingNotif(null)}
      />
    </div>
  )
}
