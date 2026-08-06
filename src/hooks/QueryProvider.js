'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { setupInterceptors } from '@/api/interceptor'

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Enable automatic refetching when window gains focus
            refetchOnWindowFocus: true,
            // Refetch when browser reconnects to internet
            refetchOnReconnect: true,
            // Refetch when component mounts if data is stale
            refetchOnMount: true,
            // Consider data stale after 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused queries in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Stop retrying immediately for genuine auth failures
            // Retry transient failures (network/server) a few times
            retry: (failureCount, error) => {
              if (error?.isAuthError) return false
              if (error?.isNetworkError) return failureCount < 3
              return failureCount < 2
            },
            // Retry with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Don't refetch if the query is disabled
            enabled: true,
          },
          mutations: {
            // Retry mutations on network error only
            retry: (failureCount, error) => {
              if (error?.isAuthError) return false
              if (error?.isNetworkError) return failureCount < 3
              return false
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
          },
        },
      })
  )

  useEffect(() => {
    setupInterceptors()
  }, [])

  // Add focus/reconnect/visibility listener for additional robustness
  useEffect(() => {
    const handleFocus = () => {
      console.log('[QueryClient] Window focused - refetching active queries')
      queryClient.refetchQueries({ stale: true })
    }

    const handleOnline = () => {
      console.log('[QueryClient] Online - refetching active queries')
      queryClient.refetchQueries({ stale: true })
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        console.log('[QueryClient] Tab visible - refetching active queries')
        queryClient.refetchQueries({ stale: true })
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}