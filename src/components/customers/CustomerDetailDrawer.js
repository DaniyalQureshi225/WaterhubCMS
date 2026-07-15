'use client'

import { X, User, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Store } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const badgeMap = { active: 'active', suspended: 'inactive', inactive: 'draft' }

export default function CustomerDetailDrawer({ customer, isOpen, onClose }) {
  if (!isOpen || !customer) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Customer Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={28} className="text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
                <Badge variant={badgeMap[customer.status] || 'default'}>{customer.status}</Badge>
              </div>
              <p className="text-sm text-slate-500">{customer.email}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm"><Mail size={15} className="text-slate-400" /><span className="text-slate-900">{customer.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><Phone size={15} className="text-slate-400" /><span className="text-slate-900">{customer.phone}</span></div>
            <div className="flex items-center gap-3 text-sm"><MapPin size={15} className="text-slate-400" /><span className="text-slate-900">{customer.city}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <ShoppingBag size={18} className="mx-auto text-emerald-600 mb-1" />
              <p className="text-lg font-bold text-slate-900">{customer.orders.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Orders</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <DollarSign size={18} className="mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold text-slate-900">Rs. {customer.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total Spent</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Assigned Seller</span><span className="font-medium text-slate-900">{customer.seller}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Join Date</span><span className="font-medium text-slate-900">{customer.joinDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Last Order</span><span className="font-medium text-slate-900">{customer.lastOrder}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium text-slate-900 text-right max-w-[200px]">{customer.address}</span></div>
          </div>
        </div>
      </div>
    </>
  )
}
