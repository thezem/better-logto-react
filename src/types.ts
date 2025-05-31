import type { LogtoConfig } from '@logto/react'

export type LogtoUser = {
  id: string
  name?: string
  email?: string
  avatar?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type AuthMiddleware = 'auth' | 'guest' | undefined

export interface NavigationOptions {
  replace?: boolean // Use replaceState instead of pushState
  force?: boolean // Force navigation even if already on the same page
}

export interface AuthOptions {
  middleware?: AuthMiddleware
  redirectTo?: string
  redirectIfAuthenticated?: string
  navigationOptions?: NavigationOptions
}

export interface AuthContextType {
  user: LogtoUser | null
  isLoadingUser: boolean
  signIn: (callbackUrl?: string) => Promise<void>
  signOut: (options?: { callbackUrl?: string; global?: boolean }) => Promise<void>
}

export interface AuthProviderProps {
  children: React.ReactNode
  config: LogtoConfig
  callbackUrl?: string
  customNavigate?: (url: string, options?: NavigationOptions) => void
}

export interface CallbackPageProps {
  className?: string
  loadingComponent?: React.ReactNode
  successComponent?: React.ReactNode
  onSuccess?: () => void
  onError?: (error: Error) => void
}
