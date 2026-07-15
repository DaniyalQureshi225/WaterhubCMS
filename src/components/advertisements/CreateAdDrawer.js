'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, Smartphone, Store, AlertCircle, Image } from 'lucide-react'

const initialForm = {
  title: '',
  subtitle: '',
  description: '',
  buttonText: '',
  buttonUrl: '',
  target: 'Both Apps',
  order: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
}

const targetMap = { 'Seller App': 'SELLER', 'Customer App': 'CUSTOMER', 'Both Apps': 'BOTH' }

export default function CreateAdDrawer({ isOpen, onClose, mutation, editAd }) {
  const [form, setForm] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [previewApp, setPreviewApp] = useState('Seller App')
  const fileRef = useRef(null)
  const fileObjectRef = useRef(null)

  useEffect(() => {
    if (editAd) {
      setForm({
        title: editAd.title || '',
        subtitle: editAd.subtitle || '',
        description: editAd.description || '',
        buttonText: editAd.buttonText || '',
        buttonUrl: editAd.buttonUrl || '',
        target: editAd.target || 'Both Apps',
        order: editAd.order?.toString() || '',
        startDate: editAd.startDate || '',
        startTime: '',
        endDate: editAd.endDate || '',
        endTime: '',
      })
      setImagePreview(editAd.image || null)
      fileObjectRef.current = null
    } else {
      setForm(initialForm)
      setImagePreview(null)
      fileObjectRef.current = null
    }
    setErrors({})
  }, [editAd, isOpen])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    fileObjectRef.current = file
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function toISOString(date, time) {
    if (!date) return ''
    const t = time || '00:00'
    return new Date(`${date}T${t}:00`).toISOString()
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!editAd && !fileObjectRef.current) e.image = 'Banner image is required'
    if (!form.target) e.target = 'Target app is required'
    if (!form.order) e.order = 'Display order is required'
    else if (isNaN(form.order) || parseInt(form.order) < 1) e.order = 'Must be a positive number'
    if (!form.startDate) e.startDate = 'Start date is required'
    if (!form.endDate) e.endDate = 'End date is required'
    if (form.startDate && form.endDate && toISOString(form.endDate) < toISOString(form.startDate)) {
      e.endDate = 'End date cannot be before start date'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('subtitle', form.subtitle.trim())
    fd.append('description', form.description.trim())
    fd.append('buttonText', form.buttonText.trim())
    fd.append('buttonUrl', form.buttonUrl.trim())
    fd.append('target', targetMap[form.target] || 'BOTH')
    fd.append('displayOrder', parseInt(form.order))
    fd.append('startDate', toISOString(form.startDate, form.startTime))
    fd.append('endDate', toISOString(form.endDate, form.endTime))

    if (fileObjectRef.current) {
      fd.append('bannerImage', fileObjectRef.current)
    }

    mutation.mutate(editAd ? { id: editAd.id, formData: fd } : fd, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[900px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {editAd ? 'Edit Advertisement' : 'Create Advertisement'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="p-6 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Advertisement Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    placeholder="e.g. Summer Water Discount"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={e => handleChange('subtitle', e.target.value)}
                    placeholder="e.g. Get 20% off on all orders"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Brief description of this advertisement..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Banner Image {!editAd && <span className="text-red-500">*</span>}
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${errors.image ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain" />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setImagePreview(null); fileObjectRef.current = null }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={28} className="text-slate-400" />
                        <p className="text-sm text-slate-600 font-medium">Click to upload banner image</p>
                        <p className="text-xs text-slate-400">PNG, JPG or WebP. Recommended ratio 16:9.</p>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                  {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={form.buttonText}
                      onChange={e => handleChange('buttonText', e.target.value)}
                      placeholder="Shop Now"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Button URL</label>
                    <input
                      type="text"
                      value={form.buttonUrl}
                      onChange={e => handleChange('buttonUrl', e.target.value)}
                      placeholder="/promo/summer"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target App <span className="text-red-500">*</span></label>
                    <select
                      value={form.target}
                      onChange={e => handleChange('target', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.target ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                    >
                      <option>Seller App</option>
                      <option>Customer App</option>
                      <option>Both Apps</option>
                    </select>
                    {errors.target && <p className="text-xs text-red-500 mt-1">{errors.target}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Order <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={e => handleChange('order', e.target.value)}
                      placeholder="1"
                      min="1"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.order ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                    />
                    {errors.order && <p className="text-xs text-red-500 mt-1">{errors.order}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date & Time <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => handleChange('startDate', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                    />
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={e => handleChange('startTime', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date & Time <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={e => handleChange('endDate', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                    />
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={e => handleChange('endTime', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.endDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.endDate}</p>}
                </div>

                {mutation.isError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {mutation.error?.response?.data?.message || 'Failed to save advertisement'}
                  </div>
                )}
              </form>
            </div>

            <div className="bg-slate-50 p-6 border-l border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                  <button
                    onClick={() => setPreviewApp('Seller App')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${previewApp === 'Seller App' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Store size={13} />
                    Seller App
                  </button>
                  <button
                    onClick={() => setPreviewApp('Customer App')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${previewApp === 'Customer App' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Smartphone size={13} />
                    Customer App
                  </button>
                </div>
              </div>

              <div className="relative mx-auto max-w-[280px]">
                <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 p-3">
                  <div className="bg-slate-900 rounded-[24px] overflow-hidden">
                    <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                      <span className="text-white text-[10px] font-medium">{previewApp === 'Seller App' ? 'Seller App' : 'WaterHub'}</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                    <div className="bg-white">
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Banner" className="w-full aspect-[16/9] object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            {form.title && <p className="text-white font-semibold text-sm leading-tight">{form.title}</p>}
                            {form.subtitle && <p className="text-white/80 text-[10px] mt-0.5">{form.subtitle}</p>}
                            {form.buttonText && (
                              <span className="inline-block mt-1.5 px-3 py-1 bg-blue-600 text-white text-[10px] font-medium rounded-md">
                                {form.buttonText}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-slate-100 flex flex-col items-center justify-center gap-2">
                          <Image size={24} className="text-slate-300" />
                          <p className="text-[10px] text-slate-400">Banner preview</p>
                        </div>
                      )}
                      <div className="p-2 flex justify-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-3">
                Preview showing how the banner appears in the {previewApp.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {mutation.isPending ? 'Saving...' : editAd ? 'Update Advertisement' : 'Save Advertisement'}
          </button>
        </div>
      </div>
    </>
  )
}
