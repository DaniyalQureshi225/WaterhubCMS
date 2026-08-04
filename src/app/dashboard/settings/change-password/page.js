'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { changePassword } from '@/services/auth.service'
import toast from 'react-hot-toast'

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Maximum 64 characters', test: (p) => p.length <= 64 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Number', test: (p) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const mutation = useMutation({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) =>
      changePassword({ currentPassword, newPassword, confirmPassword }),
    onSuccess: () => {
      toast.success('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({})
      setTouched({})
      router.push('/dashboard/settings')
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to change password. Please try again.'
      toast.error(message)
      if (err.response?.status === 401) {
        setErrors(prev => ({ ...prev, currentPassword: 'Incorrect current password.' }))
      } else if (err.response?.status === 400) {
        const backendErrors = err.response?.data?.errors
        if (backendErrors && Array.isArray(backendErrors)) {
          const newErrors = { ...errors }
          backendErrors.forEach(e => {
            if (e.field) newErrors[e.field] = e.message
            else if (e.path) newErrors[e.path] = e.message
          })
          setErrors(newErrors)
        }
      }
    },
  })

  function validateField(name, value) {
    const newErrors = { ...errors }
    switch (name) {
      case 'currentPassword':
        if (!value) newErrors.currentPassword = 'Current password is required.'
        else delete newErrors.currentPassword
        break
      case 'newPassword':
        if (!value) {
          newErrors.newPassword = 'New password is required.'
        } else {
          const failed = PASSWORD_REQUIREMENTS.filter(r => !r.test(value))
          if (failed.length > 0) {
            newErrors.newPassword = failed.map(r => r.label).join(', ')
          } else {
            delete newErrors.newPassword
          }
        }
        if (confirmPassword && value !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match.'
        } else if (confirmPassword && value === confirmPassword) {
          delete newErrors.confirmPassword
        }
        break
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your new password.'
        } else if (value !== newPassword) {
          newErrors.confirmPassword = 'Passwords do not match.'
        } else {
          delete newErrors.confirmPassword
        }
        break
    }
    setErrors(newErrors)
  }

  function handleBlur(name) {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  function isFormValid() {
    return (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      PASSWORD_REQUIREMENTS.every(r => r.test(newPassword)) &&
      newPassword === confirmPassword &&
      Object.keys(errors).length === 0
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    })
    validateField('currentPassword', currentPassword)
    validateField('newPassword', newPassword)
    validateField('confirmPassword', confirmPassword)
    if (isFormValid()) {
      mutation.mutate({ currentPassword, newPassword, confirmPassword })
    }
  }

  function clearAllFields() {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setErrors({})
    setTouched({})
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
  }

  useEffect(() => {
    return () => {
      clearAllFields()
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-center gap-3 px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Lock size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Change Password</h1>
              <p className="text-sm text-slate-500">Update your account password securely.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => { setCurrentPassword(e.target.value); if (touched.currentPassword) validateField('currentPassword', e.target.value) }}
                  onBlur={() => handleBlur('currentPassword')}
                  placeholder="Enter current password"
                  disabled={mutation.isPending}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    touched.currentPassword && errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  {showCurrent ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.currentPassword && errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); if (touched.newPassword) validateField('newPassword', e.target.value) }}
                  onBlur={() => handleBlur('newPassword')}
                  placeholder="Enter new password"
                  disabled={mutation.isPending}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    touched.newPassword && errors.newPassword ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  {showNew ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {errors.newPassword}
                </p>
              )}
              <div className="mt-2 space-y-1">
                {PASSWORD_REQUIREMENTS.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle
                      size={12}
                      className={`flex-shrink-0 ${newPassword && req.test(newPassword) ? 'text-emerald-500' : 'text-slate-300'}`}
                    />
                    <span className={`${newPassword && req.test(newPassword) ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); if (touched.confirmPassword) validateField('confirmPassword', e.target.value) }}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Confirm new password"
                  disabled={mutation.isPending}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    touched.confirmPassword && errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/dashboard/settings')}
                disabled={mutation.isPending}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !isFormValid()}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Your password will be updated immediately upon successful verification.
        </p>
      </div>
    </div>
  )
}