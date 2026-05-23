'use client'

import { useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import type { Ticker } from '@/lib/api/types'

interface ExchangeFormProps {
  tickers: Ticker[]
}

export function ExchangeForm({ tickers }: ExchangeFormProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [fromSymbol, setFromSymbol] = useState('BTC')
  const [toSymbol, setToSymbol] = useState('USDT')
  const [amount, setAmount] = useState('0')

  const fromTicker = tickers.find(t => t.baseAsset === fromSymbol) ?? tickers[0]
  const rate = fromTicker?.price ?? 1
  const result = (parseFloat(amount) || 0) * rate

  const swap = () => {
    setFromSymbol(toSymbol)
    setToSymbol(fromSymbol)
  }

  return (
    <div>
      {/* Buy / Sell toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setMode('buy')}
          className={cn(
            'flex-1 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer',
            mode === 'buy'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Buy
        </button>
        <span className="text-muted-foreground text-xs">|</span>
        <button
          onClick={() => setMode('sell')}
          className={cn(
            'flex-1 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer',
            mode === 'sell'
              ? 'bg-destructive text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Sell
        </button>
      </div>

      {/* From */}
      <div className="rounded-xl border border-border bg-muted/60 p-3 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">From</span>
          <span className="text-xs text-primary">{fromTicker?.baseAsset} · {formatPrice(fromTicker?.price ?? 0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <select
            value={fromSymbol}
            onChange={e => setFromSymbol(e.target.value)}
            className="bg-transparent text-sm font-semibold outline-none cursor-pointer text-foreground"
          >
            {tickers.map(t => <option key={t.baseAsset} value={t.baseAsset}>{t.baseAsset}</option>)}
          </select>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent text-right text-base font-bold w-28 outline-none text-foreground"
            step="0.0001"
            min="0"
          />
        </div>
      </div>

      {/* Swap button */}
      <div className="flex justify-center my-1">
        <button
          onClick={swap}
          className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
        >
          <ArrowDownUp className="size-3.5" />
        </button>
      </div>

      {/* To */}
      <div className="rounded-xl border border-border bg-muted/60 p-3 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">To</span>
          <span className="text-xs text-muted-foreground">{toSymbol}</span>
        </div>
        <div className="flex items-center justify-between">
          <select
            value={toSymbol}
            onChange={e => setToSymbol(e.target.value)}
            className="bg-transparent text-sm font-semibold outline-none cursor-pointer text-foreground"
          >
            <option value="USDT">USDT</option>
            {tickers.map(t => <option key={t.baseAsset} value={t.baseAsset}>{t.baseAsset}</option>)}
          </select>
          <span className="text-base font-bold text-foreground">{formatNumber(result, 2)}</span>
        </div>
      </div>

      {/* Rate */}
      <p className="text-center text-xs text-muted-foreground mb-3">
        1 {fromSymbol} = ${formatPrice(rate)}
      </p>

      <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_4px_14px_rgba(224,123,40,0.4)]">
        Exchange Now
      </Button>
    </div>
  )
}
