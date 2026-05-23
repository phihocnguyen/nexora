'use client'

import { useMemo } from 'react'
import type { OrderBook as OrderBookType } from '@/lib/api/types'
import { formatPrice, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OrderBookProps {
  orderBook: OrderBookType
  currentPrice: number
  priceChangePercent: number
  hideHeader?: boolean
}

export function OrderBook({ orderBook, currentPrice, priceChangePercent, hideHeader }: OrderBookProps) {
  const maxTotal = useMemo(() => {
    const allTotals = [...orderBook.asks, ...orderBook.bids].map(e => e.total)
    return Math.max(...allTotals)
  }, [orderBook])

  const isUp = priceChangePercent >= 0

  return (
    <div className="flex flex-col h-full text-xs">
      {!hideHeader && (
        <div className="px-3 py-2 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Order Book</span>
        </div>
      )}

      {/* Column headers */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-muted-foreground border-b border-border">
        <span>Price (USDT)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (sell orders) — shown top, reversed so lowest ask is near price */}
      <div className="flex flex-col-reverse overflow-hidden flex-1">
        {orderBook.asks.slice(0, 12).map((entry, i) => (
          <div key={i} className="relative grid grid-cols-3 px-3 py-[3px] hover:bg-muted/30 cursor-pointer">
            <div
              className="absolute inset-y-0 right-0 bg-destructive/10"
              style={{ width: `${(entry.total / maxTotal) * 100}%` }}
            />
            <span className="text-down font-mono relative z-10">{formatPrice(entry.price)}</span>
            <span className="text-right relative z-10 text-foreground">{formatNumber(entry.quantity, 4)}</span>
            <span className="text-right relative z-10 text-muted-foreground">{formatNumber(entry.total, 2)}</span>
          </div>
        ))}
      </div>

      {/* Current price */}
      <div className={cn(
        'flex items-center justify-center gap-2 py-2 border-y border-border font-bold',
        isUp ? 'text-up' : 'text-down',
      )}>
        <span className="text-base font-mono">{formatPrice(currentPrice)}</span>
        <span className="text-xs font-normal text-muted-foreground">≈ ${formatPrice(currentPrice)}</span>
      </div>

      {/* Bids (buy orders) */}
      <div className="flex flex-col overflow-hidden flex-1">
        {orderBook.bids.slice(0, 12).map((entry, i) => (
          <div key={i} className="relative grid grid-cols-3 px-3 py-[3px] hover:bg-muted/30 cursor-pointer">
            <div
              className="absolute inset-y-0 right-0 bg-[#0ecb81]/10"
              style={{ width: `${(entry.total / maxTotal) * 100}%` }}
            />
            <span className="text-up font-mono relative z-10">{formatPrice(entry.price)}</span>
            <span className="text-right relative z-10 text-foreground">{formatNumber(entry.quantity, 4)}</span>
            <span className="text-right relative z-10 text-muted-foreground">{formatNumber(entry.total, 2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
