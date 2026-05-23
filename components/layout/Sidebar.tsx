'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Compass, Wallet, User,
  BarChart2, Bell, Repeat2, ArrowLeftRight,
  Settings, HelpCircle, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MAIN_NAV = [
  { href: '/',              label: 'Dashboard',   icon: LayoutDashboard, exact: true },
  { href: '/markets',       label: 'Discover',    icon: Compass },
  { href: '/wallet',        label: 'Wallet',      icon: Wallet },
  { href: '/portfolio',     label: 'Portfolio',   icon: User },
  { href: '/trade/BTCUSDT', label: 'Trade',       icon: BarChart2,  matchPath: '/trade' },
  { href: '/notifications', label: 'Alerts',      icon: Bell },
  { href: '/swap',          label: 'Swap',        icon: Repeat2 },
  { href: '/convert',       label: 'Convert',     icon: ArrowLeftRight },
]

const BOTTOM_NAV = [
  { href: '#', label: 'Settings', icon: Settings },
  { href: '#', label: 'Support',  icon: HelpCircle },
  { href: '#', label: 'Logout',   icon: LogOut },
]

type NavEntry = {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  matchPath?: string
}

function NavItem({ href, label, icon: Icon, isActive }: NavEntry & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(224,123,40,0.4)]'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="hidden lg:block truncate">{label}</span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const checkActive = (item: NavEntry) => {
    if (item.exact) return pathname === item.href
    const match = item.matchPath ?? item.href
    return pathname.startsWith(match)
  }

  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/20 shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="#e07b28" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 2v20M4 7l8 5 8-5" stroke="#e07b28" strokeWidth="1.5" />
          </svg>
        </div>
        <span className="hidden lg:block font-bold text-base">
          <span className="text-primary">NEX</span>ORA
        </span>
      </Link>

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5 p-2 lg:p-3 flex-1 overflow-y-auto">
        {MAIN_NAV.map(item => (
          <NavItem key={item.label} {...item} isActive={checkActive(item)} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col gap-0.5 p-2 lg:p-3 border-t border-sidebar-border">
        {BOTTOM_NAV.map(item => (
          <NavItem key={item.label} {...item} isActive={false} />
        ))}
      </div>
    </aside>
  )
}
