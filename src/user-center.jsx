import React from 'react';
import { useAuth } from './useAuth';
import { getInitials } from './utils';
import { User, LogOut, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Skeleton } from './components/ui/skeleton';

export const UserCenter = ({
  className = '',
  globalSignOut = true,
  signoutCallbackUrl = window.location.href,
}) => {
  const { user, isLoadingUser, signIn, signOut } = useAuth();

  if (isLoadingUser) {
    return (
      <div className={`relative ${className}`}>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <Avatar className="h-9 w-9 transition-all hover:ring-2 hover:ring-slate-200">
              {user.avatar ? (
                <AvatarImage 
                  src={user.avatar} 
                  alt={user.name || 'User'} 
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-slate-50 text-slate-600 text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <DropdownMenuLabel className="px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name || 'User'}
                  </p>
                  {user.email && (
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem 
                className="focus:bg-slate-50"
                onClick={() => signOut({ callbackUrl: signoutCallbackUrl, global: globalSignOut })}
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2 p-2 font-normal"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </DropdownMenuItem>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 transition-all hover:ring-2 hover:ring-slate-200">
            <AvatarFallback className="bg-slate-50">
              <UserCircle className="h-5 w-5 text-slate-400" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <DropdownMenuLabel className="px-4 py-3">
              <p className="text-sm font-medium text-slate-900">Welcome</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem 
              className="focus:bg-slate-50"
              onClick={() => signIn()}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 p-2 font-normal"
              >
                <User className="h-4 w-4" />
                Sign in
              </Button>
            </DropdownMenuItem>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};