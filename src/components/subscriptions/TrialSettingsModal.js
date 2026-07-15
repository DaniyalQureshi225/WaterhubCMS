'use client'

import { useState, useEffect } from 'react'
import { X, Clock } from 'lucide-react'
import { useTrialDuration, useUpdateTrialDuration } from '@/hooks/useTrialDuration'
import toast from 'react-hot-toast'

export default function TrialSettingsModal({ isOpen, onClose }) {
  const { data: currentDays, isLoading } = useTrialDuration()
  const updateMutation = useUpdateTrialDuration()
  const [trialDays, setTrialDays] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && currentDays != null) {
      setTrialDays(currentDays.toString())
      setError('')
    }
  }, [isOpen, currentDays])

  function validate() {
    const num = Number(trialDays)
    if (!trialDays || isNaN(num)) {
      setError('Please enter a valid number')
      return false
    }
    if (num < 1 || num > 365) {
      setError('Trial duration must be between 1 and 365 days')
      return false
    }
    if (!Number.isInteger(num)) {
      setError('Trial duration must be a whole number')
      return false
    }
    setError('')
    return true
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    updateMutation.mutate(Number(trialDays), {
      onSuccess: () => {
        toast.success('Trial duration updated successfully')
        onClose()
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to update trial duration')
      },
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Trial Settings</h2>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Free Trial Duration</p>
                <p className="text-xs text-slate-500 mt-0.5">Set how many days new sellers get for free trial</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Trial Days <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={trialDays}
                  onChange={e => { setTrialDays(e.target.value); setError('') }}
                  placeholder="7"
                  min="1"
                  max="365"
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">days</span>
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <p className="text-xs text-slate-400 mt-1.5">Allowed range: 1 - 365 days</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending || isLoading}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
