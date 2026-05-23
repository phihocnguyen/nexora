'use client'

import { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markAllAsRead } from '@/lib/api/notification'

interface NotificationActionsProps {
  hasUnread: boolean
}

export function NotificationActions({ hasUnread }: NotificationActionsProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleMarkAll = async () => {
    setLoading(true)
    await markAllAsRead()
    setLoading(false)
    setDone(true)
  }

  if (!hasUnread || done) return null

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleMarkAll} loading={loading}>
      <CheckCheck className="size-3.5" />
      Mark all as read
    </Button>
  )
}
