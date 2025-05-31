import React from 'react';
import { useHandleSignInCallback } from '@logto/react';
import { Card, CardContent } from './components/ui/card';
import { Skeleton } from './components/ui/skeleton';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const CallbackPage = ({
  className = '',
  loadingComponent,
  successComponent,
  onSuccess,
  onError,
}) => {
  const { isLoading } = useHandleSignInCallback(async () => {
    try {
      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior: redirect to home
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Authentication callback error:', error);
      if (onError) {
        onError(error);
      }
    }
  });

  if (isLoading) {
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className={`flex min-h-screen items-center justify-center bg-slate-50 ${className}`}>
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-slate-600" />
              </div>
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  Signing you in...
                </h2>
                <p className="text-sm text-slate-500">
                  Please wait while we complete the authentication process
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (successComponent) {
    return successComponent;
  }

  return (
    <div className={`flex min-h-screen items-center justify-center bg-slate-50 ${className}`}>
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                Authentication Complete
              </h2>
              <p className="text-sm text-slate-500">
                You've been successfully authenticated. Redirecting...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};