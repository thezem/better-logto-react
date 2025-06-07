'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { LogtoProvider, useLogto } from '@logto/react'
import { transformUser, setCustomNavigate } from './utils'
import type { AuthContextType, AuthProviderProps, LogtoUser } from './types'

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Internal provider that wraps Logto's context
const InternalAuthProvider = ({
  children,
  callbackUrl,
  enablePopupSignIn,
}: {
  children: React.ReactNode
  callbackUrl?: string
  enablePopupSignIn?: boolean
}) => {
  const { isAuthenticated, isLoading, getIdTokenClaims, signIn: logtoSignIn, signOut: logtoSignOut } = useLogto()
  const [user, setUser] = useState<LogtoUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

  const loadUser = useCallback(async () => {
    if (isLoading) return

    setIsLoadingUser(true)

    if (isAuthenticated) {
      try {
        const claims = await getIdTokenClaims()
        setUser(transformUser(claims))
      } catch (error) {
        console.error('Error fetching user claims:', error)
        setUser(null)
      }
    } else {
      setUser(null)
    }

    setIsLoadingUser(false)
  }, [isLoading, isAuthenticated, getIdTokenClaims])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Add effect to handle cross-window/tab authentication state changes
  useEffect(() => {
    // Listen for storage changes (when auth state changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      // Logto typically stores auth state in localStorage
      if (e.key && (e.key.includes('logto') || e.key.includes('auth'))) {
        // Refresh auth state when storage changes
        setTimeout(() => {
          loadUser()
        }, 100) // Small delay to ensure storage is updated
      }
    }

    // Listen for window focus to refresh auth state
    const handleWindowFocus = () => {
      // Refresh auth state when window regains focus
      loadUser()
    }

    // Listen for custom auth change events
    const handleAuthChange = () => {
      loadUser()
    }

    // Add event listeners
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('auth-state-changed', handleAuthChange)

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('auth-state-changed', handleAuthChange)
    }
  }, [loadUser])

  const signIn = useCallback(
    async (overrideCallbackUrl?: string, usePopup?: boolean) => {
      // Check if we're already in a popup to prevent infinite loops
      const isInPopup = window.opener && window.opener !== window

      if (isInPopup) {
        // If we're already in a popup, just do direct sign-in without opening another popup
        const redirectUrl = overrideCallbackUrl || callbackUrl || window.location.href
        await logtoSignIn(redirectUrl)
        return
      }

      const shouldUsePopup = usePopup ?? enablePopupSignIn
      console.log(`SignIn called with usePopup=${shouldUsePopup}, enablePopupSignIn=${enablePopupSignIn}`)

      if (!shouldUsePopup) {
        const redirectUrl = overrideCallbackUrl || callbackUrl || window.location.href
        await logtoSignIn(redirectUrl)
      } else {
        // Use popup sign-in
        const popupWidth = 400
        const popupHeight = 600
        const left = window.innerWidth / 2 - popupWidth / 2
        const top = window.innerHeight / 2 - popupHeight / 2
        const popupFeatures = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`

        // Use the signin page route - assume user has it at /signin
        const popup = window.open('/signin', 'SignInPopup', popupFeatures)

        // Listen for the popup to close or complete authentication
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            // Dispatch event to refresh auth state when popup closes
            window.dispatchEvent(new CustomEvent('auth-state-changed'))
          }
        }, 1000)

        // Listen for messages from the popup
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return

          if (event.data.type === 'SIGNIN_SUCCESS' || event.data.type === 'SIGNIN_COMPLETE') {
            loadUser()
            window.dispatchEvent(new CustomEvent('auth-state-changed'))
            popup?.close()
            clearInterval(checkClosed)
          }
        }

        window.addEventListener('message', handleMessage)

        // Cleanup listener when popup closes
        const cleanupListener = () => {
          window.removeEventListener('message', handleMessage)
          clearInterval(checkClosed)
        }

        setTimeout(cleanupListener, 300000) // 5 minutes timeout
      }
    },
    [enablePopupSignIn, callbackUrl, logtoSignIn],
  )

  const signOut = useCallback(
    async (options?: { callbackUrl?: string; global?: boolean }) => {
      const { callbackUrl, global = true } = options || {}

      if (global) {
        // Global sign out - logs out from entire Logto ecosystem
        await logtoSignOut(callbackUrl)
      } else {
        // Local sign out - only clears local session
        setUser(null)
        setIsLoadingUser(false)

        // Optional: Clear any local storage or session storage if needed
        // localStorage.removeItem('logto_session')
        // sessionStorage.clear()

        if (callbackUrl) {
          window.location.href = callbackUrl
        }
      }

      // Dispatch custom event to notify other windows/tabs
      window.dispatchEvent(new CustomEvent('auth-state-changed'))
    },
    [logtoSignOut],
  )

  const value: AuthContextType = {
    user,
    isLoadingUser,
    signIn,
    signOut,
    refreshAuth: loadUser,
    enablePopupSignIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// External provider that wraps Logto's provider
export const AuthProvider = ({ children, config, callbackUrl, customNavigate, enablePopupSignIn = false }: AuthProviderProps) => {
  // Set the custom navigate function for the entire library
  useEffect(() => {
    setCustomNavigate(customNavigate || null)

    // Cleanup on unmount
    return () => setCustomNavigate(null)
  }, [customNavigate])

  return (
    <LogtoProvider config={config}>
      <InternalAuthProvider callbackUrl={callbackUrl} enablePopupSignIn={enablePopupSignIn}>
        {children}
      </InternalAuthProvider>
    </LogtoProvider>
  )
}

// Hook to use the auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
