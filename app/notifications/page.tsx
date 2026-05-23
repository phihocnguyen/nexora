import { Bell, TrendingUp, Wallet, ShoppingCart, X, Info } from 'lucide-react'
import { getNotifications } from '@/lib/api/notification'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { NotificationActions } from '@/components/notifications/NotificationActions'
import { formatTime, cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/lib/api/types'

export const metadata = { title: 'Notifications — Nexora' }

const TYPE_CONFIG: Record<NotificationType, {
  icon: React.ReactNode
  badge: 'success' | 'info' | 'warning' | 'destructive' | 'outline'
  label: string
}> = {
  ORDER_FILLED:    { icon: <ShoppingCart className="size-4 text-up" />,  badge: 'success',     label: 'Order' },
  ORDER_CANCELED:  { icon: <X className="size-4 text-destructive" />,    badge: 'destructive', label: 'Order' },
  DEPOSIT:         { icon: <Wallet className="size-4 text-up" />,         badge: 'success',     label: 'Deposit' },
  WITHDRAWAL:      { icon: <Wallet className="size-4 text-muted-foreground" />, badge: 'warning', label: 'Withdrawal' },
  PRICE_ALERT:     { icon: <TrendingUp className="size-4 text-primary" />, badge: 'warning',   label: 'Alert' },
  SYSTEM:          { icon: <Info className="size-4 text-info" />,          badge: 'info',       label: 'System' },
}

function NotificationItem({ notification: n }: { notification: Notification }) {
  const config = TYPE_CONFIG[n.type]
  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-lg border transition-colors',
      n.read ? 'border-border/50 bg-transparent' : 'border-primary/20 bg-primary/5',
    )}>
      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-semibold', !n.read && 'text-foreground')}>{n.title}</span>
            <Badge variant={config.badge}>{config.label}</Badge>
            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {formatTime(n.time)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
      </div>
    </div>
  )
}

export default async function NotificationsPage() {
  const notifications = await getNotifications()
  const unread = notifications.filter(n => !n.read)
  const read = notifications.filter(n => n.read)

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Notifications</h1>
          {unread.length > 0 && (
            <Badge variant="destructive">{unread.length} unread</Badge>
          )}
        </div>
        <NotificationActions hasUnread={unread.length > 0} />
      </div>

      {unread.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              New ({unread.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unread.map(n => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </CardContent>
        </Card>
      )}

      {read.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground">Earlier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {read.map(n => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </CardContent>
        </Card>
      )}

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </div>
  )
}
