'use client'

import { useState, useEffect } from 'react'
import { X, Image, CheckCircle, XCircle } from 'lucide-react'
import apiClient from '@/api/axios'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1$/, '')

export default function ApprovalDrawer({ approval, isOpen, onClose, onApprove, onReject, isLoading }) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [screenshotBlob, setScreenshotBlob] = useState(null)

  useEffect(() => {
    if (!approval?.paymentScreenshot || !isOpen) {
      setScreenshotBlob(null)
      return
    }

    const path = approval.paymentScreenshot.startsWith('http')
      ? approval.paymentScreenshot
      : `${API_BASE}${approval.paymentScreenshot}`

    let cancelled = false

    apiClient.get(path, { responseType: 'blob' })
      .then(({ data }) => {
        if (!cancelled) setScreenshotBlob(URL.createObjectURL(data))
      })
      .catch(() => {
        if (!cancelled) setScreenshotBlob(null)
      })

    return () => {
      cancelled = true
      if (screenshotBlob) URL.revokeObjectURL(screenshotBlob)
    }
  }, [approval?.paymentScreenshot, isOpen])

  if (!isOpen) return null

    

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {isLoading ? 'Loading...' : 'Payment Approval'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : !approval ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
            No data available
          </div>
        ) : (
        <>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {screenshotBlob ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <img
                src={screenshotBlob}
                alt="Payment Screenshot"
                className="w-lg h-96 object-contain"
              />
            </div>
          ) : isLoading ? (
            <div className="w-full aspect-video rounded-xl bg-slate-100 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-slate-100 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Image size={40} />
                <span className="text-sm">No payment screenshot</span>
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Seller Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Shop Name</span><p className="font-medium text-slate-900">{approval.shopName}</p></div>
              <div><span className="text-slate-500">Phone</span><p className="font-medium text-slate-900">{approval.phone}</p></div>
              <div className="col-span-2"><span className="text-slate-500">Email</span><p className="font-medium text-slate-900">{approval.email}</p></div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Selected Plan</span><span className="font-medium text-slate-900">{approval.plan}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-medium text-slate-900">Rs. {approval.amount?.toLocaleString()}</span></div>
            {approval.paymentRef && <div className="flex justify-between"><span className="text-slate-500">Payment Reference</span><span className="font-medium text-slate-900">{approval.paymentRef}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Payment Date</span><span className="font-medium text-slate-900">{approval.paymentDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Requested On</span><span className="font-medium text-slate-900">{approval.requestedOn}</span></div>
          </div>

          {showRejectInput && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reject Reason</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for rejection..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}
          </div>
        </>)}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0">
          {showRejectInput ? (
            <>
              <button onClick={() => { setShowRejectInput(false); setRejectReason('') }} className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  onReject(approval, rejectReason || 'No reason provided')
                  setShowRejectInput(false)
                  setRejectReason('')
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                <XCircle size={16} /> Confirm Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onApprove(approval)
                  onClose()
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-lg shadow-emerald-600/25 transition-all duration-200"
              >
                <CheckCircle size={16} /> Approve Subscription
              </button>
              <button
                onClick={() => setShowRejectInput(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
              >
                <XCircle size={16} /> Reject Subscription
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
