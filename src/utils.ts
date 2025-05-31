import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LogtoUser } from './types'

/**
 * Transform Logto user object to a simpler format
 */
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

/**
 * Navigate to a URL, handling both client-side routing and direct navigation
 */
export const navigateTo = (url: string): void => {
  window.location.href = url
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
