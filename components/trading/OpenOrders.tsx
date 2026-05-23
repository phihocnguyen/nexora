'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cancelOrder, getOrderHistory } from '@/lib/api/trading'
import { formatPrice, formatNumber, formatTime, cn } from '@/lib/utils'
import type { Order } from '@/lib/api/types'

const STATUS_VARIANT: Record<Order['status'], 'warning' | 'success' | 'destructive' | 'info' | 'outline'> = {
  NEW: 'warning',
  PARTIALLY_FILLED: 'info',
  FILLED: 'success',
  CANCELED: 'outline',
  REJECTED: 'destructive',
}

interface OpenOrdersProps {
  openOrders: Order[]
  allOrders: Order[]
}

export function OpenOrders({ openOrders: initialOpen, allOrders: initialAll }: OpenOrdersProps) {
  const [open, setOpen] = useState(initialOpen)
  const [all] = useState(initialAll)
  const [canceling, setCanceling] = useState<string | null>(null)

  const handleCancel = async (order: Order) => {
    setCanceling(order.orderId)
    try {
      await cancelOrder(order.symbol, order.orderId)
      setOpen(prev => prev.filter(o => o.orderId !== order.orderId))
    } finally {
      setCanceling(null)
    }
  }

  const OrderRow = ({ order }: { order: Order }) => (
    <TableRow>
      <TableCell className="text-xs text-muted-foreground">{formatTime(order.time)}</TableCell>
      <TableCell className="font-medium">{order.symbol}</TableCell>
      <TableCell>
        <span className={cn('text-xs font-semibold', order.side === 'BUY' ? 'text-up' : 'text-down')}>
          {order.side}
        </span>
      </TableCell>
      <TableCell className="text-xs">{order.type}</TableCell>
      <TableCell className="font-mono">{formatPrice(order.price)}</TableCell>
      <TableCell className="font-mono">{formatNumber(order.origQty, 4)}</TableCell>
      <TableCell className="font-mono">{formatNumber(order.executedQty, 4)}</TableCell>
      <TableCell><Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge></TableCell>
      <TableCell>
        {(order.status === 'NEW' || order.status === 'PARTIALLY_FILLED') && (
          <Button
            variant="ghost" size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => handleCancel(order)}
            loading={canceling === order.orderId}
          >
            <X className="size-3" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )

  return (
    <div className="border-t border-border">
      <Tabs defaultValue="open">
        <div className="px-4 border-b border-border">
          <TabsList className="gap-0">
            <TabsTrigger value="open">
              Open Orders {open.length > 0 && <span className="ml-1.5 text-primary">{open.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="open" className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead><TableHead>Pair</TableHead><TableHead>Side</TableHead>
                <TableHead>Type</TableHead><TableHead>Price</TableHead><TableHead>Amount</TableHead>
                <TableHead>Filled</TableHead><TableHead>Status</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {open.length === 0
                ? <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No open orders</TableCell></TableRow>
                : open.map(o => <OrderRow key={o.orderId} order={o} />)
              }
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="history" className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead><TableHead>Pair</TableHead><TableHead>Side</TableHead>
                <TableHead>Type</TableHead><TableHead>Price</TableHead><TableHead>Amount</TableHead>
                <TableHead>Filled</TableHead><TableHead>Status</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {all.map(o => <OrderRow key={o.orderId} order={o} />)}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
