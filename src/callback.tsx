import React from 'react'
import { useHandleSignInCallback } from '@logto/react'

export interface CallbackPageProps {
  className?: string
  loadingComponent?: React.ReactNode
  successComponent?: React.ReactNode
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const CallbackPage: React.FC<CallbackPageProps> = ({ className = '', loadingComponent, successComponent, onSuccess, onError }) => {
  const { isLoading } = useHandleSignInCallback(() => {
    try {
      if (onSuccess) {
        onSuccess()
      } else {
        // Default behavior: redirect to home
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Authentication callback error:', error)
      if (onError) {
        onError(error as Error)
      }
    }
  })

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        {loadingComponent || (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <div className="text-lg text-slate-600">Signing you in...</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${className}`}>
      {successComponent || (
        <div className="text-center">
          <div className="text-lg text-slate-600">Authentication complete! Redirecting...</div>
        </div>
      )}
    </div>
  )
}
