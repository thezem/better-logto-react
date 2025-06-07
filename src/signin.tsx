'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from './useAuth'
import LoadingSpinner from './components/ui/loading-spinner'

export function SignInPage() {
  const { user, signIn, isLoadingUser } = useAuth()
  const [isPopup, setIsPopup] = useState(false)
  const signInCalled = useRef(false)

  useEffect(() => {
    // Method 1: Check if window has an opener (opened by another window)
    const hasOpener = window.opener && window.opener !== window

    const isOpenedByScript = window.opener !== null && window.opener !== undefined

    setIsPopup(hasOpener || isOpenedByScript)
  }, [])

  useEffect(() => {
    if (isLoadingUser) return

    if (user) {
      if (isPopup && window.opener && window.opener !== window) {
        window.opener.postMessage({ type: 'SIGNIN_COMPLETE' }, window.location.origin)
        setTimeout(() => window.close(), 100)
      } else {
        window.location.href = '/'
      }
      return
    }

    if (!signInCalled.current) {
      signInCalled.current = true
      // Pass false for usePopup parameter to prevent nested popups when already in a popup
      signIn(undefined, false)
    }
  }, [isPopup, user, isLoadingUser, signIn])

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return null
}
