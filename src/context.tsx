import React, { createContext, useContext, useEffect, useState } from 'react'
import { LogtoProvider, useLogto } from '@logto/react'
import { transformUser } from './utils'
import type { AuthContextType, AuthProviderProps, LogtoUser } from './types'

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Internal provider that wraps Logto's context
const InternalAuthProvider = ({ children, callbackUrl }: { children: React.ReactNode; callbackUrl?: string }) => {
  const { isAuthenticated, isLoading, getIdTokenClaims, signIn: logtoSignIn, signOut: logtoSignOut } = useLogto()
  const [user, setUser] = useState<LogtoUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

  useEffect(() => {
    const loadUser = async () => {
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
    }

    loadUser()
  }, [isAuthenticated, isLoading, getIdTokenClaims])

  const signIn = async (overrideCallbackUrl?: string) => {
    const redirectUrl = overrideCallbackUrl || callbackUrl || window.location.href
    await logtoSignIn(redirectUrl)
  }

  const signOut = async (callbackUrl?: string) => {
    await logtoSignOut(callbackUrl)
  }

  const value: AuthContextType = {
    user,
    isLoadingUser,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// External provider that wraps Logto's provider
export const AuthProvider = ({ children, config, callbackUrl }: AuthProviderProps) => {
  return (
    <LogtoProvider config={config}>
      <InternalAuthProvider callbackUrl={callbackUrl}>{children}</InternalAuthProvider>
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
