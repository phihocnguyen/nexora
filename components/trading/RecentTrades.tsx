import type { Trade } from '@/lib/api/types'
import { formatPrice, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface RecentTradesProps {
  trades: Trade[]
  hideHeader?: boolean
}

export function RecentTrades({ trades, hideHeader }: RecentTradesProps) {
  return (
    <div className="flex flex-col h-full text-xs">
      {!hideHeader && (
        <div className="px-3 py-2 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Recent Trades</span>
        </div>
      )}
      <div className="grid grid-cols-3 px-3 py-1.5 text-muted-foreground border-b border-border">
        <span>Price (USDT)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>
      <div className="overflow-y-auto flex-1">
        {trades.map(trade => {
          const time = new Date(trade.time)
          const hms = time.toLocaleTimeString('en-US', { hour12: false })
          return (
            <div key={trade.id} className="grid grid-cols-3 px-3 py-[3px] hover:bg-muted/20">
              <span className={cn('font-mono', trade.isBuyerMaker ? 'text-down' : 'text-up')}>
                {formatPrice(trade.price)}
              </span>
              <span className="text-right text-foreground">{formatNumber(trade.quantity, 4)}</span>
              <span className="text-right text-muted-foreground">{hms}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
