import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { getNotifications } from '@/lib/api/notification'

export const metadata: Metadata = {
  title: 'Nexora — Crypto Trading',
  description: 'Professional crypto trading platform',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const notifications = await getNotifications()

  return (
    <html lang="en" className="dark">
      <body className="h-screen flex flex-col bg-background text-foreground antialiased overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar notifications={notifications} />
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
