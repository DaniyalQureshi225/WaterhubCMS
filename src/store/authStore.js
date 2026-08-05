import { create } from 'zustand'
import { STORAGE_KEYS } from '@/constants/storage'
import { getAccessToken } from '@/api/interceptor'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  _hydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') {
      console.log('[Auth] Hydrate: Server side, skipping')
      set({ _hydrated: true })
      return
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER)
      const user = raw ? JSON.parse(raw) : null
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

      const hasValidToken = !!accessToken && !!getAccessToken()
      console.log('[Auth] Hydrate:', { hasUser: !!user, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken, isAuthenticated: hasValidToken })
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: hasValidToken,
        _hydrated: true,
      })
    } catch (error) {
      console.log('[Auth] Hydrate error:', error)
      set({ _hydrated: true })
    }
  },

  setAuth: ({ user, accessToken, refreshToken }) => {
    console.log('[Auth] setAuth called')
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    }
    set({ user, accessToken, refreshToken, isAuthenticated: true, _hydrated: true })
  },

  clearAuth: () => {
    console.log('[Auth] clearAuth called')
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
  },
}))

export default useAuthStore