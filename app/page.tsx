import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { getTickers } from '@/lib/api/market'
import { getPortfolio } from '@/lib/api/portfolio'
import { getWallet } from '@/lib/api/wallet'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MiniSparkline } from '@/components/market/MiniSparkline'
import { CandlestickChart } from '@/components/market/CandlestickChart'
import { getKlines } from '@/lib/api/market'
import { ExchangeForm } from '@/components/trading/ExchangeForm'
import { formatNumber, formatPrice, formatPercent, isPositive, cn } from '@/lib/utils'

export default async function DashboardPage() {
  const [tickers, portfolio, wallet, btcKlines] = await Promise.all([
    getTickers(),
    getPortfolio(),
    getWallet(),
    getKlines('BTCUSDT', '1h', 48),
  ])

  const btc = tickers.find(t => t.symbol === 'BTCUSDT')!
  const eth = tickers.find(t => t.symbol === 'ETHUSDT')!
  const bnb = tickers.find(t => t.symbol === 'BNBUSDT')!

  const sparkData = (ticker: typeof btc) => {
    const pts: number[] = []
    let p = ticker.price * 0.96
    for (let i = 0; i < 20; i++) {
      p = p * (1 + (Math.random() - 0.48) * 0.015)
      pts.push(p)
    }
    pts.push(ticker.price)
    return pts
  }

  const COIN_CARDS = [
    { ticker: btc,  color: '#e07b28', bg: 'from-[#e07b28]/20 to-transparent', label: 'Bitcoin' },
    { ticker: eth,  color: '#627eea', bg: 'from-[#627eea]/20 to-transparent', label: 'Ethereum' },
    { ticker: bnb,  color: '#f0b90b', bg: 'from-[#f0b90b]/20 to-transparent', label: 'BNB' },
  ]

  const INTERVALS = ['1D', '2D', '3D', '1W', '1M', '1Y']

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto p-4 gap-4">
        {/* Coin overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COIN_CARDS.map(({ ticker, color, bg, label }) => (
            <Link key={ticker.symbol} href={`/trade/${ticker.symbol}`}>
              <Card className={cn(
                'relative overflow-hidden bg-gradient-to-br hover:border-primary/40 transition-all duration-200 cursor-pointer',
                bg,
              )}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: `${color}25`, color }}>
                        {ticker.baseAsset[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ticker.baseAsset}</p>
                      </div>
                    </div>
                    <div className={cn(
                      'flex items-center gap-0.5 text-xs font-medium',
                      isPositive(ticker.priceChangePercent) ? 'text-up' : 'text-down',
                    )}>
                      {isPositive(ticker.priceChangePercent)
                        ? <ArrowUpRight className="size-3" />
                        : <ArrowDownRight className="size-3" />}
                      {Math.abs(ticker.priceChangePercent).toFixed(2)}%
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="flex justify-center my-1">
                    <MiniSparkline
                      data={sparkData(ticker)}
                      color={isPositive(ticker.priceChangePercent) ? '#0ecb81' : '#f6465d'}
                      height={44}
                      width={180}
                    />
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    <p className="text-xl font-bold font-mono">${formatPrice(ticker.price)}</p>
                    <span className={cn(
                      'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                      isPositive(ticker.priceChangePercent)
                        ? 'bg-[#0ecb81]/15 text-[#0ecb81]'
                        : 'bg-destructive/15 text-destructive',
                    )}>
                      {formatPercent(ticker.priceChangePercent)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Chart */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">BTC / USDT</span>
              <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                <span>R <span className="text-foreground">2,046.00</span></span>
                <span>L <span className="text-foreground">2,075.00</span></span>
                <span>M <span className="text-foreground">2,086.00</span></span>
                <span>Y <span className="text-foreground">2,099.00</span></span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {INTERVALS.map(iv => (
                <button key={iv}
                  className={cn(
                    'px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer',
                    iv === '1M'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  )}>
                  {iv}
                </button>
              ))}
            </div>
          </div>
          <div className="px-2 pb-2">
            <CandlestickChart klines={btcKlines} height={300} />
          </div>
        </Card>

        {/* Markets table */}
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Markets</h3>
            <Link href="/markets" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left px-4 py-2.5 font-medium w-8">#</th>
                  <th className="text-left px-4 py-2.5 font-medium">Name</th>
                  <th className="text-right px-4 py-2.5 font-medium">Last Price</th>
                  <th className="text-right px-4 py-2.5 font-medium">24h %</th>
                  <th className="text-right px-4 py-2.5 font-medium hidden md:table-cell">Market cap</th>
                  <th className="text-center px-4 py-2.5 font-medium hidden lg:table-cell">Last 7 days</th>
                  <th className="text-center px-4 py-2.5 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickers.slice(0, 6).map((t, i) => (
                  <tr key={t.symbol} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                          {t.baseAsset[0]}
                        </div>
                        <div>
                          <span className="font-semibold">{t.baseAsset}</span>
                          <span className="text-muted-foreground ml-1.5 text-xs">{t.symbol.replace('USDT','')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium">${formatPrice(t.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('text-xs font-semibold', isPositive(t.priceChangePercent) ? 'text-up' : 'text-down')}>
                        {formatPercent(t.priceChangePercent)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground hidden md:table-cell">
                      ${formatNumber(t.quoteVolume24h / 1000, 0)}M
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex justify-center">
                        <MiniSparkline
                          data={sparkData(t)}
                          color={isPositive(t.priceChangePercent) ? '#0ecb81' : '#f6465d'}
                          height={32}
                          width={80}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/trade/${t.symbol}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150">
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-col w-72 border-l border-border overflow-y-auto shrink-0">
        {/* Exchange form */}
        <div className="p-4 border-b border-border">
          <ExchangeForm tickers={tickers} />
        </div>

        {/* Portfolio list */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">My Portfolios</h3>
            <Link href="/portfolio" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {portfolio.positions.map(pos => (
              <Link key={pos.symbol} href={`/trade/${pos.symbol}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent transition-colors group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {pos.baseAsset[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{pos.baseAsset}</p>
                    <p className="text-[11px] text-muted-foreground">${formatPrice(pos.currentPrice)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-xs font-semibold', isPositive(pos.unrealizedPnlPercent) ? 'text-up' : 'text-down')}>
                    {formatPercent(pos.unrealizedPnlPercent)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{formatNumber(pos.quantity, 4)} {pos.baseAsset}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
