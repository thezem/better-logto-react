import { useEffect } from 'react';
import { useAuthContext } from './context';
import { navigateTo } from './utils';
import type { AuthOptions, AuthContextType } from './types';

export const useAuth = (options?: AuthOptions): AuthContextType => {
  const auth = useAuthContext();
  const { user, isLoadingUser } = auth;

  useEffect(() => {
    if (isLoadingUser) return;

    const { middleware, redirectTo, redirectIfAuthenticated } = options || {};

    if (middleware === 'auth' && !user) {
      // User is not authenticated but the route requires authentication
      navigateTo(redirectTo || '/404');
    } else if (middleware === 'guest' && user && redirectIfAuthenticated) {
      // User is authenticated but the route is for guests only
      navigateTo(redirectIfAuthenticated);
    }
  }, [user, isLoadingUser, options]);

  return auth;
};