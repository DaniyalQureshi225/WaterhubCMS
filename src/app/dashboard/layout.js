'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Droplets, LayoutDashboard, Search, Bell, ChevronDown,
  Menu, LogOut, Settings, CreditCard, Shield, Megaphone, Bug
} from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import useAuthStore from '@/store/authStore'

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Subscriptions', icon: CreditCard, path: '/dashboard/subscriptions' },
  { name: 'Advertisements', icon: Shield, path: '/dashboard/advertisements' },
  { name: 'Notifications', icon: Megaphone, path: '/dashboard/notifications' },
  { name: 'Crash Logs', icon: Bug, path: '/dashboard/crash-logs', adminOnly: true },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, clearAuth, hydrate, _hydrated, isAuthenticated } = useAuthStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (_hydrated && !isAuthenticated) {
      router.push('/')
    }
  }, [_hydrated, isAuthenticated, router])

  function handleLogout() {
    clearAuth()
    router.push('/')
  }

  if (!_hydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-slate-200
        transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 px-5 h-[70px] border-b border-slate-200">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900">WaterHub</span>
            <span className="block text-[10px] font-medium text-blue-600 uppercase tracking-wider">Super Admin</span>
          </div>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-70px)]">
          <nav className="p-3 space-y-0.5">
            {sidebarItems
              .filter(item => !item.adminOnly || user?.role === 'ADMIN')
              .map(item => {
              const isActive = pathname === item.path
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={19} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              )
            })}
          </nav>

          <div className="p-3 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
            >
              <LogOut size={19} className="text-slate-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <header className="fixed top-0 right-0 z-20 h-[70px] bg-white/80 backdrop-blur-md border-b border-slate-200 left-0 lg:left-[260px]">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Avatar name={user?.name ? user.name : 'Admin User'} size="sm" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900 leading-tight">{user?.name ? user.name : 'Admin User'}</p>
                  <p className="text-xs text-slate-500 leading-tight">{user?.email ? user.email : 'admin@waterhub.com'}</p>
                </div>
                <ChevronDown size={15} className="text-slate-400 hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-20 py-1.5">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user?.name ? user.name : 'Admin User'}</p>
                      <p className="text-xs text-slate-500">{user?.email ? user.email : 'admin@waterhub.com'}</p>
                    </div>
                    <button
                      onClick={() => { router.push('/dashboard/settings'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings size={16} className="text-slate-400" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen ml-0 lg:ml-[260px] pt-[70px]">
        <div className="max-w-[1600px] mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}