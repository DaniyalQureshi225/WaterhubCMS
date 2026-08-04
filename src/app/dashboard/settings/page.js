'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Lock, Shield, User, Bell, Palette } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

const settingsOptions = [
  {
    name: 'Change Password',
    description: 'Update your account password securely with verification.',
    icon: Lock,
    path: '/dashboard/settings/verify',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Security Settings',
    description: 'Manage two-factor authentication and login security.',
    icon: Shield,
    path: '/dashboard/settings/security',
    color: 'bg-amber-50 text-amber-600',
    disabled: true,
  },
  {
    name: 'Profile',
    description: 'Update your personal information and preferences.',
    icon: User,
    path: '/dashboard/settings/profile',
    color: 'bg-emerald-50 text-emerald-600',
    disabled: true,
  },
  {
    name: 'Notifications',
    description: 'Configure how you receive system notifications.',
    icon: Bell,
    path: '/dashboard/settings/notifications',
    color: 'bg-violet-50 text-violet-600',
    disabled: true,
  },
  {
    name: 'Appearance',
    description: 'Customize theme, language, and display options.',
    icon: Palette,
    path: '/dashboard/settings/appearance',
    color: 'bg-purple-50 text-purple-600',
    disabled: true,
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const [hovered, setHovered] = useState(null)

  function handleClick(path, disabled) {
    if (!disabled) router.push(path)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsOptions.map((option) => (
          <Card
            key={option.name}
            className={`transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
              option.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <button
              type="button"
              disabled={option.disabled}
              onClick={() => handleClick(option.path, option.disabled)}
              onMouseEnter={() => !option.disabled && setHovered(option.name)}
              onMouseLeave={() => setHovered(null)}
              className="w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${option.color}`}>
                  <option.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">{option.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
                  {option.disabled && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 mt-2">
                      Coming Soon
                    </span>
                  )}
                </div>
                {!option.disabled && (
                  <ChevronRight size={18} className={`text-slate-300 transition-colors ${hovered === option.name ? 'text-blue-500' : ''}`} />
                )}
              </div>
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}