import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import LoadingSpinner from './components/ui/loading-spinner'

export function SignInPage() {
  const { user, signIn, isLoadingUser } = useAuth()
  const [isPopup, setIsPopup] = useState(false)

  useEffect(() => {
    // Method 1: Check if window has an opener (opened by another window)
    const hasOpener = window.opener && window.opener !== window

    const isOpenedByScript = window.opener !== null && window.opener !== undefined

    setIsPopup(hasOpener || isOpenedByScript)
  }, [])

  useEffect(() => {
    if (user) {
      if (isPopup) {
        // Send message to parent window before closing
        if (window.opener && window.opener !== window) {
          window.opener.postMessage({ type: 'SIGNIN_SUCCESS', user }, window.location.origin)
        }
        // Small delay to ensure message is sent before closing
        setTimeout(() => {
          window.close()
        }, 100)
      } else {
        // If not a popup, redirect to the home page or a specific URL
        window.location.href = '/'
      }
    } else if (!isLoadingUser) {
      // If user is not authenticated, trigger sign-in
      signIn()
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
