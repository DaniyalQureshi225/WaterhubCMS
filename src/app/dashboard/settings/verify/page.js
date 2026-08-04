'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, AlertCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const VERIFICATION_PHRASE = 'Daniyal bhai zindabad'
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 30000

export default function SecurityVerificationPage() {
  const router = useRouter()
  const [phrase, setPhrase] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)
  const [showPhrase, setShowPhrase] = useState(false)

  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1000) {
            clearInterval(timer)
            setIsLocked(false)
            setAttempts(0)
            setLockoutTime(0)
            setError('')
            return 0
          }
          return prev - 1000
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isLocked, lockoutTime])

  function formatTime(ms) {
    const seconds = Math.ceil(ms / 1000)
    return `${seconds}s`
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (isLocked) return

    setError('')

    if (phrase === VERIFICATION_PHRASE) {
      setPhrase('')
      setAttempts(0)
      setError('')
      router.push('/dashboard/settings/change-password')
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)

    if (nextAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true)
      setLockoutTime(LOCKOUT_DURATION)
      setError(`Too many failed verification attempts. Please wait ${LOCKOUT_DURATION / 1000} seconds before trying again.`)
    } else {
      setError('Incorrect verification phrase.')
    }
  }

  function handleChange(e) {
    if (isLocked) return
    setPhrase(e.target.value)
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-center gap-3 px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Shield size={24} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Security Verification</h1>
              <p className="text-sm text-slate-500">For security reasons, please enter the verification phrase before continuing.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label htmlFor="verification-phrase" className="block text-sm font-medium text-slate-700 mb-1.5">
                Verification Phrase <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="verification-phrase"
                  type={showPhrase ? 'text' : 'password'}
                  value={phrase}
                  onChange={handleChange}
                  placeholder="Enter verification phrase"
                  disabled={isLocked}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error && !isLocked ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPhrase(!showPhrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  {showPhrase ? 'Hide' : 'Show'}
                </button>
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {isLocked && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <Clock size={16} className="text-amber-600 flex-shrink-0" />
                <span className="text-sm text-amber-800">
                  Retry in <strong>{formatTime(lockoutTime)}</strong>
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLocked}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium shadow-lg shadow-amber-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              Continue
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          You will be redirected to the Change Password screen after successful verification.
        </p>
      </div>
    </div>
  )
}