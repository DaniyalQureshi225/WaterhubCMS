'use client'

import { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'

export default function RenewModal({ isOpen, onClose, onRenew }) {
  const [plan, setPlan] = useState('Monthly')
  const [screenshot, setScreenshot] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  if (!isOpen) return null

  function handleSubmit() {
    setSaving(true)
    setTimeout(() => {
      onRenew({ plan, screenshot })
      setSaving(false)
      setPlan('Monthly')
      setScreenshot(null)
    }, 500)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Renew Subscription</h2>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Choose Plan</label>
              <div className="grid grid-cols-2 gap-3">
                {['Monthly', 'Annual'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      plan === p ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900 block">{p}</span>
                    <span className="text-xs text-slate-500">{p === 'Monthly' ? 'Rs. 15,000/mo' : 'Rs. 120,000/yr'}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Payment Screenshot</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
              >
                {screenshot ? (
                  <div className="relative inline-block">
                    <img src={screenshot} alt="Preview" className="max-h-24 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setScreenshot(null); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    ><X size={12} /></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload size={24} className="text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">Click to upload</p>
                    <p className="text-xs text-slate-400">Payment confirmation screenshot</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) { const r = new FileReader(); r.onload = ev => setScreenshot(ev.target.result); r.readAsDataURL(f) }
                }} className="hidden" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Processing...' : 'Renew Subscription'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
