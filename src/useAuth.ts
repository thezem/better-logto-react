'use client'
import { useEffect, useMemo } from 'react'
import { useAuthContext } from './context'
import { navigateTo } from './utils'
import type { AuthOptions, AuthContextType } from './types'

export const useAuth = (options?: AuthOptions): AuthContextType => {
  const auth = useAuthContext()
  const { user, isLoadingUser } = auth

  // Memoize the options to prevent infinite re-renders when options object reference changes
  const memoizedOptions = useMemo(
    () => ({
      middleware: options?.middleware,
      redirectTo: options?.redirectTo,
      redirectIfAuthenticated: options?.redirectIfAuthenticated,
      navigationOptions: options?.navigationOptions,
    }),
    [options?.middleware, options?.redirectTo, options?.redirectIfAuthenticated, options?.navigationOptions],
  )

  useEffect(() => {
    if (isLoadingUser) return

    const { middleware, redirectTo, redirectIfAuthenticated, navigationOptions } = memoizedOptions

    if (middleware === 'auth' && !user) {
      // User is not authenticated but the route requires authentication
      navigateTo(redirectTo || '/404', navigationOptions)
    } else if (middleware === 'guest' && user && redirectIfAuthenticated) {
      // User is authenticated but the route is for guests only
      navigateTo(redirectIfAuthenticated, navigationOptions)
    }
  }, [user, isLoadingUser, memoizedOptions])

  return auth
}
