'use client'

import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, HelpCircle } from 'lucide-react'
import { cn, formatNumber, formatPrice } from '@/lib/utils'
import { placeOrder } from '@/lib/api/trading'
import type { OrderType, Ticker } from '@/lib/api/types'

// ── Order type metadata ──────────────────────────────────────────────────────
const ORDER_TYPES: {
  value: OrderType
  label: string
  color: string
  summary: string
  tip: string
}[] = [
  {
    value:   'LIMIT',
    label:   'Limit',
    color:   'text-primary',
    summary: 'Set your price, wait for fill',
    tip:     'Your order is placed in the book at a specific price. It only executes when the market reaches that price — or better. Best for: non-urgent trades where price matters.',
  },
  {
    value:   'MARKET',
    label:   'Market',
    color:   'text-[#0ecb81]',
    summary: 'Fill now at best available price',
    tip:     'Executes immediately against existing orders at whatever the current best price is. Fast and guaranteed, but price can "slip" in volatile markets. Best for: urgent entries/exits.',
  },
  {
    value:   'STOP_LIMIT',
    label:   'Stop-Limit',
    color:   'text-destructive',
    summary: 'Trigger → then place a limit order',
    tip:     'Set a stop (trigger) price and a limit price. When market hits the stop, a limit order is automatically placed at your limit price. Best for: stop-losses or breakout entries.',
  },
]

const PERCENT_STEPS = [25, 50, 75, 100]

interface TradeFormProps {
  ticker: Ticker
  availableBase: number
  availableQuote: number
}

export function TradeForm({ ticker, availableBase, availableQuote }: TradeFormProps) {
  const [side, setSide]             = useState<'BUY' | 'SELL'>('BUY')
  const [orderType, setOrderType]   = useState<OrderType>('LIMIT')
  const [price, setPrice]           = useState(formatPrice(ticker.price))
  const [stopPrice, setStopPrice]   = useState(formatPrice(ticker.price * 0.99))
  const [qty, setQty]               = useState('')
  const [pct, setPct]               = useState(0)
  const [loading, setLoading]       = useState(false)
  const [toast, setToast]           = useState<{ ok: boolean; text: string } | null>(null)
  const [showTip, setShowTip]       = useState(false)

  const isBuy        = side === 'BUY'
  const available    = isBuy ? availableQuote : availableBase
  const assetLabel   = isBuy ? 'USDT' : ticker.baseAsset
  const parsedPrice  = parseFloat(price)  || ticker.price
  const parsedQty    = parseFloat(qty)    || 0
  const total        = parsedPrice * parsedQty
  const fee          = total * 0.001
  const currentType  = ORDER_TYPES.find(t => t.value === orderType)!

  // ── % slider ──────────────────────────────────────────────────────────────
  const applyPercent = useCallback((p: number) => {
    setPct(p)
    if (isBuy) {
      setQty(formatNumber((available * p) / 100 / parsedPrice, 6))
    } else {
      setQty(formatNumber((available * p) / 100, 6))
    }
  }, [isBuy, available, parsedPrice])

  const handleQtyChange = (v: string) => {
    setQty(v)
    const q = parseFloat(v) || 0
    if (available > 0) {
      const used = isBuy ? q * parsedPrice : q
      setPct(Math.min(100, Math.round((used / available) * 100)))
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const showToast = (ok: boolean, text: string) => {
    setToast({ ok, text })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (!parsedQty || parsedQty <= 0) throw new Error('Enter a valid amount')
      await placeOrder({
        symbol:      ticker.symbol,
        side,
        type:        orderType,
        price:       orderType !== 'MARKET' ? parsedPrice : undefined,
        quantity:    parsedQty,
        timeInForce: 'GTC',
      })
      showToast(true, `${side} order placed — ${formatNumber(parsedQty, 4)} ${ticker.baseAsset}`)
      setQty(''); setPct(0)
    } catch (e) {
      showToast(false, e instanceof Error ? e.message : 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Buy / Sell tabs */}
      <div className="px-4 pt-3 pb-0 shrink-0">
        <div className="flex rounded-xl overflow-hidden border border-border">
          <button
            onClick={() => { setSide('BUY'); setQty(''); setPct(0) }}
            className={cn(
              'flex-1 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer',
              isBuy
                ? 'bg-[#0ecb81] text-white shadow-[inset_0_-3px_10px_rgba(14,203,129,0.4)]'
                : 'bg-transparent text-muted-foreground hover:text-[#0ecb81]',
            )}
          >
            Buy
          </button>
          <button
            onClick={() => { setSide('SELL'); setQty(''); setPct(0) }}
            className={cn(
              'flex-1 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer',
              !isBuy
                ? 'bg-destructive text-white shadow-[inset_0_-3px_10px_rgba(246,70,93,0.4)]'
                : 'bg-transparent text-muted-foreground hover:text-destructive',
            )}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-3">

        {/* ── Order type selector ──────────────────────────────────────── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Order Type
            </span>
            <button
              onClick={() => setShowTip(v => !v)}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <HelpCircle className="size-3" />
              What's this?
            </button>
          </div>

          {/* Segmented control */}
          <div className="flex gap-1 p-0.5 bg-muted rounded-xl">
            {ORDER_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => { setOrderType(t.value); setShowTip(false) }}
                className={cn(
                  'flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer',
                  orderType === t.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Inline description */}
          <div className={cn(
            'rounded-xl border px-3 py-2 transition-all duration-200 overflow-hidden',
            showTip ? 'border-border bg-muted/50' : 'border-transparent bg-transparent py-0 h-0',
          )}>
            {showTip && (
              <>
                <p className={cn('text-xs font-semibold mb-1', currentType.color)}>
                  {currentType.label} — {currentType.summary}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {currentType.tip}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Available balance ────────────────────────────────────────── */}
        <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border px-3 py-2">
          <div>
            <p className="text-[10px] text-muted-foreground">
              Available to {isBuy ? 'spend' : 'sell'}
            </p>
            <p className="text-xs font-semibold text-foreground mt-0.5">
              {isBuy
                ? `Your USDT — used to buy ${ticker.baseAsset}`
                : `Your ${ticker.baseAsset} — the asset you're selling`}
            </p>
          </div>
          <button
            onClick={() => applyPercent(100)}
            className="text-right cursor-pointer hover:text-primary transition-colors shrink-0 ml-2"
          >
            <p className={cn('text-sm font-bold', isBuy ? 'text-foreground' : 'text-foreground')}>
              {formatNumber(available, available < 1 ? 6 : 2)}
            </p>
            <p className="text-[10px] text-muted-foreground">{assetLabel} · tap to use all</p>
          </button>
        </div>

        {/* ── Stop price (only Stop-Limit) ─────────────────────────────── */}
        {orderType === 'STOP_LIMIT' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-muted-foreground">Stop (Trigger) Price</label>
              <span className="text-[10px] text-muted-foreground/60">→ activates the limit order below</span>
            </div>
            <div className="flex items-center bg-muted rounded-xl border border-border focus-within:border-destructive transition-colors">
              <input
                type="number" value={stopPrice}
                onChange={e => setStopPrice(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-foreground outline-none min-w-0"
                step="0.01"
              />
              <span className="px-3 text-xs text-muted-foreground shrink-0">USDT</span>
            </div>
          </div>
        )}

        {/* ── Limit price ───────────────────────────────────────────────── */}
        {orderType !== 'MARKET' && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              {orderType === 'STOP_LIMIT' ? 'Limit Price' : 'Price'}
              {orderType === 'LIMIT' && (
                <span className="ml-1.5 text-[10px] text-muted-foreground/60">
                  · order fills at this price or better
                </span>
              )}
            </label>
            <div className="flex items-center bg-muted rounded-xl border border-border focus-within:border-primary transition-colors">
              <input
                type="number" value={price}
                onChange={e => setPrice(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-foreground outline-none min-w-0"
                step="0.01"
              />
              <span className="px-3 text-xs text-muted-foreground shrink-0">USDT</span>
            </div>
          </div>
        )}

        {/* Market notice */}
        {orderType === 'MARKET' && (
          <div className="flex items-start gap-2 rounded-xl bg-[#0ecb81]/10 border border-[#0ecb81]/20 px-3 py-2">
            <Info className="size-3.5 text-[#0ecb81] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#0ecb81] leading-relaxed">
              No price needed — fills instantly at the best current market price.
              Actual fill price may differ slightly (slippage).
            </p>
          </div>
        )}

        {/* ── Amount ──────────────────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Amount <span className="text-muted-foreground/60">({ticker.baseAsset})</span>
          </label>
          <div className="flex items-center bg-muted rounded-xl border border-border focus-within:border-primary transition-colors">
            <input
              type="number" value={qty}
              onChange={e => handleQtyChange(e.target.value)}
              placeholder="0.0000"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/40 min-w-0"
              step="0.0001" min="0"
            />
            <span className="px-3 text-xs text-muted-foreground shrink-0">{ticker.baseAsset}</span>
          </div>
        </div>

        {/* ── % slider + quick buttons ─────────────────────────────────── */}
        <div className="space-y-2">
          <div className="relative h-1.5 bg-muted rounded-full mx-1">
            <div
              className={cn('absolute h-full rounded-full transition-[width] duration-75', isBuy ? 'bg-[#0ecb81]' : 'bg-destructive')}
              style={{ width: `${pct}%` }}
            />
            <input
              type="range" min={0} max={100} step={1} value={pct}
              onChange={e => applyPercent(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
            <div
              className={cn('absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-background transition-[left] duration-75', isBuy ? 'bg-[#0ecb81]' : 'bg-destructive')}
              style={{ left: `calc(${pct}% - 7px)` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {PERCENT_STEPS.map(p => (
              <button
                key={p}
                onClick={() => applyPercent(p)}
                className={cn(
                  'py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border',
                  pct === p
                    ? isBuy
                      ? 'bg-[#0ecb81]/15 border-[#0ecb81]/50 text-[#0ecb81]'
                      : 'bg-destructive/15 border-destructive/50 text-destructive'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
                )}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        {/* ── Order summary ────────────────────────────────────────────── */}
        {parsedQty > 0 && (
          <div className="rounded-xl bg-muted/40 border border-border px-3 py-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>{isBuy ? 'You pay' : 'You receive'}</span>
              <span className="font-semibold text-foreground">{formatNumber(total, 2)} USDT</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{isBuy ? 'You receive' : 'You sell'}</span>
              <span className="font-semibold text-foreground">{formatNumber(parsedQty, 6)} {ticker.baseAsset}</span>
            </div>
            <div className="border-t border-border/60 pt-1.5 flex justify-between text-muted-foreground">
              <span className="flex items-center gap-1"><Info className="size-3" /> Est. fee (0.1%)</span>
              <span>{formatNumber(fee, 4)} USDT</span>
            </div>
          </div>
        )}

        {/* ── Toast ───────────────────────────────────────────────────── */}
        {toast && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border',
            toast.ok
              ? 'bg-[#0ecb81]/10 text-[#0ecb81] border-[#0ecb81]/30'
              : 'bg-destructive/10 text-destructive border-destructive/30',
          )}>
            {toast.ok ? <CheckCircle className="size-3.5 shrink-0" /> : <XCircle className="size-3.5 shrink-0" />}
            {toast.text}
          </div>
        )}

        {/* ── Submit ──────────────────────────────────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={loading || !parsedQty}
          className={cn(
            'w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isBuy
              ? 'bg-[#0ecb81] text-white hover:bg-[#0bb574] shadow-[0_4px_14px_rgba(14,203,129,0.35)]'
              : 'bg-destructive text-white hover:bg-[#d93c50] shadow-[0_4px_14px_rgba(246,70,93,0.35)]',
          )}
        >
          {loading
            ? <span className="inline-flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Placing order…
              </span>
            : `${isBuy ? 'Buy' : 'Sell'} ${ticker.baseAsset}`
          }
        </button>
      </div>
    </div>
  )
}
