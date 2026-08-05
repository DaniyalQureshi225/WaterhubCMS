'use client'

import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/auth.service'
import useAuthStore from '@/store/authStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log('[Auth] Login success:', response.data)
      const { user, accessToken, refreshToken } = response.data
      setAuth({ user, accessToken, refreshToken })
      toast.success('Login Successful')
      router.push('/dashboard')
    },
    onError: (error) => {
      console.log('[Auth] Login error:', error.response?.status, error.response?.data, error.message)
      const message = error.userMessage || error.response?.data?.message || error.response?.data?.errors?.[0] || 'Login failed. Please try again.'
      toast.error(message)
    },
  })
}