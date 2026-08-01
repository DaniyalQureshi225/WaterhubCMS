'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, Send, Clock, Calendar } from 'lucide-react'

const initialForm = {
  title: '',
  message: '',
  audience: '',
  targetUser: '',
  sendOption: 'now',
  scheduleDate: '',
  scheduleTime: '',
}

export default function CreateNotificationModal({ isOpen, onClose, mutation }) {
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const fileRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm)
      setImageFile(null)
      setImagePreview(null)
      setErrors({})
      setUserSearch('')
      setSearchResults([])
      setSelectedUser(null)
      setShowUserDropdown(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!userSearch.trim() || form.audience !== 'SPECIFIC_USER') {
      setSearchResults([])
      return
    }
    const debounce = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers?search=${encodeURIComponent(userSearch)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('wh_access_token') || ''}` },
      })
        .then(r => r.json())
        .then(res => {
          const users = (res.data || []).map(u => ({
            id: u._id,
            name: u.shopName || u.ownerName || 'Unknown',
            phone: u.phone || '',
            email: u.email || '',
          }))
          setSearchResults(users)
        })
        .catch(() => setSearchResults([]))
    }, 400)
    return () => clearTimeout(debounce)
  }, [userSearch, form.audience])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Only JPG, PNG, WebP images allowed' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }))
      return
    }
    setImageFile(file)
    setErrors(prev => ({ ...prev, image: null }))
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleSelectUser(user) {
    setSelectedUser(user)
    handleChange('targetUser', user.id)
    setUserSearch(`${user.name} ${user.phone ? '(' + user.phone + ')' : ''}`)
    setShowUserDropdown(false)
  }

  function toISOString(date, time) {
    if (!date) return ''
    const t = time || '00:00'
    return new Date(`${date}T${t}:00`).toISOString()
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    else if (form.title.length > 100) e.title = 'Title must be 100 characters or less'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.length > 500) e.message = 'Message must be 500 characters or less'
    if (!form.audience) e.audience = 'Audience is required'
    if (form.audience === 'SPECIFIC_USER' && !form.targetUser) e.targetUser = 'Select a target user'
    if (form.sendOption === 'later') {
      if (!form.scheduleDate) e.scheduleDate = 'Date is required'
      if (!form.scheduleTime) e.scheduleTime = 'Time is required'
      if (form.scheduleDate && form.scheduleTime) {
        const dt = new Date(`${form.scheduleDate}T${form.scheduleTime}:00`)
        if (dt <= new Date()) e.scheduleDate = 'Schedule time must be in the future'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('message', form.message.trim())
    fd.append('audience', form.audience)
    if (form.audience === 'SPECIFIC_USER' && form.targetUser) {
      fd.append('targetUser', form.targetUser)
    }
    if (form.sendOption === 'later' && form.scheduleDate && form.scheduleTime) {
      fd.append('scheduleAt', toISOString(form.scheduleDate, form.scheduleTime))
    }
    if (imageFile) {
      fd.append('image', imageFile)
    }

    mutation.mutate(fd, { onSuccess: () => onClose() })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-slate-900">Send Notification</h2>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="Notification title"
                maxLength={100}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                <span className="text-xs text-slate-400 ml-auto">{form.title.length}/100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={e => handleChange('message', e.target.value)}
                placeholder="Write your notification message..."
                rows={4}
                maxLength={500}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                <span className="text-xs text-slate-400 ml-auto">{form.message.length}/500</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${errors.image ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30'}`}
              >
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="max-h-20 rounded-lg object-contain" />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <Upload size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-500">Click to upload image (JPG, PNG, WebP - max 5MB)</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
              </div>
              {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Audience <span className="text-red-500">*</span>
              </label>
              <select
                value={form.audience}
                onChange={e => { handleChange('audience', e.target.value); setSelectedUser(null); setUserSearch('') }}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.audience ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
              >
                <option value="">Select audience</option>
                <option value="ALL">All Users</option>
                <option value="SELLERS">All Sellers</option>
                <option value="CUSTOMERS">All Customers</option>
                <option value="SPECIFIC_USER">Specific User</option>
              </select>
              {errors.audience && <p className="text-xs text-red-500 mt-1">{errors.audience}</p>}
            </div>

            {form.audience === 'SPECIFIC_USER' && (
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target User <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => { setUserSearch(e.target.value); setShowUserDropdown(true); setSelectedUser(null); handleChange('targetUser', '') }}
                  onFocus={() => setShowUserDropdown(true)}
                  placeholder="Search by name, phone, or email..."
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.targetUser ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                />
                {errors.targetUser && <p className="text-xs text-red-500 mt-1">{errors.targetUser}</p>}
                {showUserDropdown && searchResults.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                      {searchResults.map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSelectUser(user)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                        >
                          <p className="text-sm font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.phone} {user.email ? `· ${user.email}` : ''}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Schedule</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('sendOption', 'now')}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    form.sendOption === 'now' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Send size={16} /> Send Now
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('sendOption', 'later')}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    form.sendOption === 'later' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Clock size={16} /> Schedule for Later
                </button>
              </div>
            </div>

            {form.sendOption === 'later' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Calendar size={14} className="inline mr-1" />Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.scheduleDate}
                    onChange={e => handleChange('scheduleDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.scheduleDate ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                  />
                  {errors.scheduleDate && <p className="text-xs text-red-500 mt-1">{errors.scheduleDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Clock size={14} className="inline mr-1" />Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.scheduleTime}
                    onChange={e => handleChange('scheduleTime', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.scheduleTime ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                  />
                  {errors.scheduleTime && <p className="text-xs text-red-500 mt-1">{errors.scheduleTime}</p>}
                </div>
              </div>
            )}

            {mutation.isError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {mutation.error?.response?.data?.message || 'Failed to send notification'}
              </div>
            )}
          </form>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {mutation.isPending ? 'Sending...' : form.sendOption === 'now' ? 'Send Now' : 'Schedule Notification'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
