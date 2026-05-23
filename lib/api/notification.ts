import type { Notification } from './types'
import { MOCK_NOTIFICATIONS } from './mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getNotifications(): Promise<Notification[]> {
  if (USE_MOCK) return MOCK_NOTIFICATIONS
  const { api } = await import('./client')
  return api.get('notification', '/api/v1/notifications')
}

export async function markAsRead(id: string): Promise<void> {
  if (USE_MOCK) return
  const { api } = await import('./client')
  await api.put('notification', `/api/v1/notifications/${id}/read`, {})
}

export async function markAllAsRead(): Promise<void> {
  if (USE_MOCK) return
  const { api } = await import('./client')
  await api.put('notification', '/api/v1/notifications/read-all', {})
}
