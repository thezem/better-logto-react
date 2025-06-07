import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LogtoUser, NavigationOptions } from './types'

/**
 * Transform Logto user object to a simpler format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformUser = (logtoUser: any): LogtoUser | null => {
  if (!logtoUser) return null

  return {
    id: logtoUser.sub || '',
    name: logtoUser.name || logtoUser.username || '',
    email: logtoUser.email || '',
    avatar: logtoUser.picture || '',
    // Include all original properties
    ...logtoUser,
  }
}

// Global reference to custom navigate function (can be set by the provider)
let customNavigateFunction: ((url: string, options?: NavigationOptions) => void) | null = null

/**
 * Set a custom navigation function (used by AuthProvider)
 */
export const setCustomNavigate = (navigateFn: ((url: string, options?: NavigationOptions) => void) | null) => {
  customNavigateFunction = navigateFn
}

/**
 * Navigate to a URL, handling both client-side routing and direct navigation
 * Attempts to use client-side routing first (History API), then falls back to window.location
 */
export const navigateTo = (url: string, options: NavigationOptions = {}): void => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return

    // Use custom navigate function if provided (e.g., from React Router)
    if (customNavigateFunction) {
      customNavigateFunction(url, options)
      return
    }

    const { replace = false, force = false } = options

    // Check if the URL is already the current URL to prevent infinite loops
    if (!force && (window.location.pathname === url || window.location.href === url)) {
      return
    }

    // For relative URLs, try to use History API for client-side routing
    if (url.startsWith('/')) {
      // Try to use History API if available (better for SPAs)
      if (window.history && (window.history.pushState || window.history.replaceState)) {
        if (replace && window.history.replaceState) {
          window.history.replaceState(null, '', url)
        } else if (window.history.pushState) {
          window.history.pushState(null, '', url)
        }

        // Dispatch a popstate event to notify router libraries
        const event = new PopStateEvent('popstate', { state: null })
        window.dispatchEvent(event)

        // Also dispatch a custom event for frameworks that listen for it
        const navigationEvent = new CustomEvent('navigate', { detail: { url, replace } })
        window.dispatchEvent(navigationEvent)

        return
      }
    }

    // Fallback to window.location for absolute URLs or if History API failed
    if (replace) {
      window.location.replace(url)
    } else {
      window.location.href = url
    }
  } catch (error) {
    // Final fallback - direct assignment
    console.warn('Navigation failed, using fallback method:', error)
    window.location.href = url
  }
}

/**
 * Get initials from name for avatar fallback
 */
export const getInitials = (name?: string): string => {
  if (!name) return 'U'

  const parts = name.split(' ')
  if (parts.length === 1) {
    return name.substring(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Cookie management utilities
 */
export const cookieUtils = {
  /**
   * Set a cookie with the given name, value, and options
   */
  setCookie: (
    name: string,
    value: string,
    options: {
      expires?: Date | number
      maxAge?: number
      domain?: string
      path?: string
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
      httpOnly?: boolean
    } = {},
  ) => {
    if (typeof document === 'undefined') return

    const { expires, maxAge, domain, path = '/', secure = window.location.protocol === 'https:', sameSite = 'lax' } = options

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (expires) {
      const expireDate = typeof expires === 'number' ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000) : expires
      cookieString += `; expires=${expireDate.toUTCString()}`
    }

    if (maxAge !== undefined) {
      cookieString += `; max-age=${maxAge}`
    }

    if (domain) {
      cookieString += `; domain=${domain}`
    }

    if (path) {
      cookieString += `; path=${path}`
    }

    if (secure) {
      cookieString += `; secure`
    }

    if (sameSite) {
      cookieString += `; samesite=${sameSite}`
    }

    document.cookie = cookieString
  },

  /**
   * Get a cookie value by name
   */
  getCookie: (name: string): string | null => {
    if (typeof document === 'undefined') return null

    const nameEQ = encodeURIComponent(name) + '='
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }

    return null
  },

  /**
   * Remove a cookie by name
   */
  removeCookie: (
    name: string,
    options: {
      domain?: string
      path?: string
    } = {},
  ) => {
    if (typeof document === 'undefined') return

    const { domain, path = '/' } = options

    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`

    if (domain) {
      cookieString += `; domain=${domain}`
    }

    if (path) {
      cookieString += `; path=${path}`
    }

    document.cookie = cookieString
  },
}

/**
 * Specialized functions for JWT token management
 */
export const jwtCookieUtils = {
  /**
   * Save JWT token to cookie
   */
  saveToken: (token: string) => {
    cookieUtils.setCookie('logto_authtoken', token, {
      expires: 7, // 7 days
      secure: true,
      sameSite: 'strict',
      path: '/',
    })
  },

  /**
   * Get JWT token from cookie
   */
  getToken: (): string | null => {
    return cookieUtils.getCookie('logto_authtoken')
  },

  /**
   * Remove JWT token from cookie
   */
  removeToken: () => {
    cookieUtils.removeCookie('logto_authtoken', {
      path: '/',
    })
  },
}

/**
 * Utility function to combine class names (for components)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
