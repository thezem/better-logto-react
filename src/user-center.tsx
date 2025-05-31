import React from 'react'
import { useAuth } from './useAuth'
import { getInitials } from './utils'
import { User, LogOut, UserCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu'
import { Button } from './components/ui/button'

export interface UserCenterProps {
  className?: string
  globalSignOut?: boolean
  signoutCallbackUrl?: string
}

export const UserCenter: React.FC<UserCenterProps> = ({
  className = '',
  globalSignOut = true,
  signoutCallbackUrl = window.location.href,
}) => {
  const { user, isLoadingUser, signIn, signOut } = useAuth()

  if (isLoadingUser) {
    return (
      <div className={`relative ${className}`}>
        <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
      </div>
    )
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className={`h-9 w-9 transition-all hover:ring-2 hover:ring-red-2 ${className}`}>
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name || 'User'} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-slate-50 text-slate-600 text-sm">{getInitials(user.name)}</AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="px-2 py-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold text-slate-900">{user.name || 'User'}</p>
              {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100" />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: signoutCallbackUrl, global: globalSignOut })}>
            <Button variant={'destructive'} className="w-full flex text-left">
              <LogOut className="mr-2.5 h-4 w-4" />
              Sign out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="destructive-none">
        <Avatar className={`h-9 w-9 transition-all hover:ring-2 hover:ring-slate-200 ${className}`}>
          <AvatarFallback className="bg-slate-50">
            <UserCircle className="h-5 w-5 text-slate-400" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="px-3 py-2">
          <p className="text-sm font-medium text-slate-900">Sign in to your account</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem onClick={() => signIn()}>
          <Button variant={'default'} className=" w-full flex gap-1.5 text-left">
            <User className="h-4 w-4" />
            Sign in
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
