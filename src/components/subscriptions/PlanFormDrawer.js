'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const defaultFeatures = ['Order Management', 'Customer Tracking', 'Basic Analytics', 'Email Support']

const initialState = {
  name: '',
  price: '',
  duration: '1',
  durationType: 'MONTH',
  description: '',
  status: 'active',
}

export default function PlanFormDrawer({ isOpen, onClose, mutation, editPlan }) {
  const [form, setForm] = useState(initialState)
  const [features, setFeatures] = useState(defaultFeatures)
  const [errors, setErrors] = useState({})

  const formKey = isOpen ? (editPlan ? editPlan.id || editPlan._id || 'edit' : 'create') : null
  const [prevFormKey, setPrevFormKey] = useState(formKey)

  if (formKey !== prevFormKey) {
    setPrevFormKey(formKey)
    if (editPlan) {
      setForm({
        name: editPlan.name || '',
        price: editPlan.price?.toString() || '',
        duration: editPlan.duration?.toString() || '1',
        durationType: editPlan.durationType || 'MONTH',
        description: editPlan.description || '',
        status: editPlan.status?.toLowerCase() || 'active',
      })
      setFeatures(editPlan.features?.length ? [...editPlan.features] : defaultFeatures)
    } else {
      setForm(initialState)
      setFeatures(defaultFeatures)
    }
    setErrors({})
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function handleFeatureChange(index, value) {
    setFeatures(prev => prev.map((f, i) => i === index ? value : f))
  }

  function addFeature() {
    setFeatures(prev => [...prev, ''])
  }

  function removeFeature(index) {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Plan name is required'
    if (!form.price) e.price = 'Price is required'
    else if (isNaN(form.price) || Number(form.price) <= 0) e.price = 'Must be a positive number'
    if (!form.description.trim()) e.description = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    mutation.mutate({ form, features, editPlan })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {editPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Monthly Pro"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (Rs.) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                  placeholder="15000"
                  min="0"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={e => handleChange('duration', e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration Type</label>
                <select
                  value={form.durationType}
                  onChange={e => handleChange('durationType', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MONTH">Month</option>
                  <option value="YEAR">Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe what this plan includes..."
                rows={3}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Features</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={e => handleFeatureChange(idx, e.target.value)}
                      placeholder={`Feature ${idx + 1}`}
                      className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {mutation.isError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {mutation.error?.response?.data?.message || 'Failed to save plan'}
              </div>
            )}
          </form>
        </div>

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
            {mutation.isPending ? 'Saving...' : editPlan ? 'Update Plan' : 'Save Plan'}
          </button>
        </div>
      </div>
    </>
  )
}
