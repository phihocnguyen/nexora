'use client'

import Link from 'next/link'
import { Search, Bell, Settings, User } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLinkItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'
import type { Notification } from '@/lib/api/types'

interface NavbarProps {
  notifications: Notification[]
}

export function Navbar({ notifications }: NavbarProps) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <header className="flex h-14 items-center border-b border-border bg-card/60 backdrop-blur px-5 gap-4">
      {/* Page title area */}
      <div className="flex-1">
        <h2 className="text-base font-semibold text-foreground">Overview</h2>
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
          <span>Exchange: <span className="text-primary font-medium">$768</span></span>
          <span>Market Capacity: <span className="text-primary font-medium">$867,890,654</span></span>
          <span>24h Volume: <span className="text-primary font-medium">$678,547,654</span></span>
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground w-48 border border-border hover:border-primary/40 transition-colors cursor-text">
        <Search className="size-3.5 shrink-0" />
        <span className="text-xs">Search anything…</span>
      </div>

      {/* Premium badge */}
      <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/30 text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer">
        Premium account
      </button>

      {/* Icons */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            'relative inline-flex items-center justify-center h-8 w-8 rounded-xl',
            'text-muted-foreground hover:text-foreground hover:bg-accent transition-colors outline-none',
          )}>
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unread > 0 && <Badge variant="destructive">{unread} new</Badge>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map(n => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
                <div className="flex items-center gap-2 w-full">
                  <span className={cn('text-xs font-semibold', !n.read && 'text-primary')}>{n.title}</span>
                  {!n.read && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLinkItem href="/notifications" className="justify-center text-xs text-primary font-medium">
              View all notifications
            </DropdownMenuLinkItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Settings className="size-4" />
        </button>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-bold outline-none hover:bg-primary/30 transition-colors">
            U
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLinkItem href="/portfolio">Portfolio</DropdownMenuLinkItem>
            <DropdownMenuLinkItem href="/wallet">Wallet</DropdownMenuLinkItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
