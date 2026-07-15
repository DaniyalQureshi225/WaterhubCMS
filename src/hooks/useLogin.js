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
      const { user, accessToken, refreshToken } = response.data
      setAuth({ user, accessToken, refreshToken })
      toast.success('Login Successful')
      router.push('/dashboard')
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        'Login failed. Please try again.'
      toast.error(message)
    },
  })
}
