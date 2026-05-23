import { notFound } from 'next/navigation'
import { getTicker, getKlines, getOrderBook, getRecentTrades } from '@/lib/api/market'
import { getOpenOrders, getOrderHistory } from '@/lib/api/trading'
import { getWallet } from '@/lib/api/wallet'
import { TradePanels } from '@/components/trading/TradePanels'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatPercent, formatVolume, isPositive, cn } from '@/lib/utils'
import { ArrowUp, ArrowDown } from 'lucide-react'

type PageProps = { params: Promise<{ symbol: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { symbol } = await params
  return { title: `${symbol} — Trade — Nexora` }
}

export default async function TradePage({ params }: PageProps) {
  const { symbol } = await params

  const [ticker, klines, orderBook, trades, openOrders, allOrders, wallet] = await Promise.all([
    getTicker(symbol).catch(() => null),
    getKlines(symbol, '4h', 100),
    getOrderBook(symbol),
    getRecentTrades(symbol, 30),
    getOpenOrders(symbol),
    getOrderHistory(symbol),
    getWallet(),
  ])

  if (!ticker) notFound()

  const baseBalance  = wallet.balances.find(b => b.asset === ticker.baseAsset)
  const quoteBalance = wallet.balances.find(b => b.asset === ticker.quoteAsset)

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Ticker header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 px-4 py-2 border-b border-border bg-card/60 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {ticker.baseAsset[0]}
          </div>
          <span className="font-bold text-sm">
            {ticker.baseAsset}
            <span className="text-muted-foreground font-normal">/{ticker.quoteAsset}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={cn('text-xl font-bold font-mono leading-none', isPositive(ticker.priceChangePercent) ? 'text-up' : 'text-down')}>
            {formatPrice(ticker.price)}
          </span>
          {isPositive(ticker.priceChangePercent)
            ? <ArrowUp className="size-3.5 text-up" />
            : <ArrowDown className="size-3.5 text-down" />}
          <Badge variant={isPositive(ticker.priceChangePercent) ? 'success' : 'destructive'} className="ml-0.5">
            {formatPercent(ticker.priceChangePercent)}
          </Badge>
        </div>

        {([
          ['24h High', formatPrice(ticker.high24h)],
          ['24h Low',  formatPrice(ticker.low24h)],
          [`Vol (${ticker.baseAsset})`, formatVolume(ticker.volume24h)],
          ['Vol (USDT)', formatVolume(ticker.quoteVolume24h)],
        ] as [string, string][]).map(([label, val]) => (
          <div key={label} className="hidden sm:block shrink-0">
            <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
            <p className="text-xs font-semibold">{val}</p>
          </div>
        ))}
      </div>

      {/* ── Resizable panels ──────────────────────────────────────────── */}
      <TradePanels
        symbol={symbol}
        ticker={ticker}
        klines={klines}
        orderBook={orderBook}
        trades={trades}
        openOrders={openOrders}
        allOrders={allOrders}
        availableBase={baseBalance?.free ?? 0}
        availableQuote={quoteBalance?.free ?? 0}
      />
    </div>
  )
}
