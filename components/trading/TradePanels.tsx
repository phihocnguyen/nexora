'use client'

import { useState, useCallback } from 'react'
import { HResizeHandle, VResizeHandle } from '@/components/ui/resizable'
import { OrderBook } from './OrderBook'
import { RecentTrades } from './RecentTrades'
import { TradeForm } from './TradeForm'
import { OpenOrders } from './OpenOrders'
import { CandlestickChart } from '@/components/market/CandlestickChart'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { OrderBook as OrderBookType, Trade, Kline, Ticker, Order } from '@/lib/api/types'

const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']

// Size constraints
const OB_MIN = 180; const OB_MAX = 420
const FORM_MIN = 240; const FORM_MAX = 380
const TRADES_MIN = 100; const TRADES_MAX = 400

interface TradePanelsProps {
  symbol: string
  ticker: Ticker
  klines: Kline[]
  orderBook: OrderBookType
  trades: Trade[]
  openOrders: Order[]
  allOrders: Order[]
  availableBase: number
  availableQuote: number
}

export function TradePanels({
  symbol, ticker, klines, orderBook, trades,
  openOrders, allOrders, availableBase, availableQuote,
}: TradePanelsProps) {
  const [obWidth, setObWidth]       = useState(230)  // order-book column px
  const [formWidth, setFormWidth]   = useState(272)  // trade-form column px
  const [tradesH, setTradesH]       = useState(160)  // recent-trades height px

  const onResizeOb = useCallback((delta: number) => {
    setObWidth(w => Math.min(OB_MAX, Math.max(OB_MIN, w + delta)))
  }, [])

  const onResizeForm = useCallback((delta: number) => {
    setFormWidth(w => Math.min(FORM_MAX, Math.max(FORM_MIN, w - delta)))
  }, [])

  const onResizeTrades = useCallback((delta: number) => {
    setTradesH(h => Math.min(TRADES_MAX, Math.max(TRADES_MIN, h + delta)))
  }, [])

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">

      {/* ── Col 1: Order book + Recent trades (resizable width) ─────────── */}
      <div
        className="hidden lg:flex flex-col border-r border-border overflow-hidden shrink-0"
        style={{ width: obWidth }}
      >
        {/* Order book label */}
        <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-foreground">Order Book</span>
          <span className="text-[10px] text-muted-foreground">Asks / Bids</span>
        </div>

        {/* Order book body */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <OrderBook
            orderBook={orderBook}
            currentPrice={ticker.price}
            priceChangePercent={ticker.priceChangePercent}
            hideHeader
          />
        </div>

        {/* Vertical drag handle between OB and Trades */}
        <VResizeHandle onResize={onResizeTrades} />

        {/* Recent trades */}
        <div
          className="border-t border-border overflow-hidden shrink-0 flex flex-col"
          style={{ height: tradesH }}
        >
          <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-foreground">Recent Trades</span>
            <span className="text-[10px] text-muted-foreground">Executed</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <RecentTrades trades={trades} hideHeader />
          </div>
        </div>
      </div>

      {/* Horizontal drag handle between Col1 and Col2 */}
      <HResizeHandle onResize={onResizeOb} className="hidden lg:flex" />

      {/* ── Col 2: Chart + Open orders (flexible) ───────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Interval selector */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border shrink-0">
          {INTERVALS.map(iv => (
            <Link
              key={iv}
              href={`/trade/${symbol}?interval=${iv}`}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                iv === '4h'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              {iv}
            </Link>
          ))}
        </div>

        {/* Chart — fills available height */}
        <div className="flex-1 min-h-0 p-2">
          <CandlestickChart klines={klines} height={undefined} fillContainer />
        </div>

        {/* Open orders */}
        <div className="shrink-0 border-t border-border max-h-52 overflow-y-auto">
          <OpenOrders openOrders={openOrders} allOrders={allOrders} />
        </div>
      </div>

      {/* Horizontal drag handle between Col2 and Col3 */}
      <HResizeHandle onResize={onResizeForm} />

      {/* ── Col 3: Trade form (resizable width) ─────────────────────────── */}
      <div
        className="flex flex-col border-l border-border overflow-hidden shrink-0 bg-card/30"
        style={{ width: formWidth }}
      >
        <TradeForm
          ticker={ticker}
          availableBase={availableBase}
          availableQuote={availableQuote}
        />
      </div>
    </div>
  )
}
