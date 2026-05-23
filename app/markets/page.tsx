import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { getTickers } from '@/lib/api/market'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MiniSparkline } from '@/components/market/MiniSparkline'
import { formatPrice, formatPercent, formatVolume, isPositive, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export const metadata = { title: 'Markets — Nexora' }

export default async function MarketsPage() {
  const tickers = await getTickers()

  const gainers = [...tickers].sort((a, b) => b.priceChangePercent - a.priceChangePercent).slice(0, 3)
  const losers = [...tickers].sort((a, b) => a.priceChangePercent - b.priceChangePercent).slice(0, 3)

  function sparkData(price: number) {
    const pts: number[] = []
    let p = price * 0.96
    for (let i = 0; i < 14; i++) {
      p = p * (1 + (Math.random() - 0.48) * 0.015)
      pts.push(p)
    }
    pts.push(price)
    return pts
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Market Overview</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[#0ecb81] animate-pulse" />
          Live
        </div>
      </div>

      {/* Top movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-up">
              <TrendingUp className="size-4" /> Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gainers.map(t => (
              <Link key={t.symbol} href={`/trade/${t.symbol}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {t.baseAsset[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.baseAsset}</p>
                    <p className="text-xs text-muted-foreground">{t.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(t.price)}</p>
                  <Badge variant="success">{formatPercent(t.priceChangePercent)}</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-down">
              <TrendingDown className="size-4" /> Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {losers.map(t => (
              <Link key={t.symbol} href={`/trade/${t.symbol}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center text-destructive text-xs font-bold">
                    {t.baseAsset[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.baseAsset}</p>
                    <p className="text-xs text-muted-foreground">{t.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(t.price)}</p>
                  <Badge variant="destructive">{formatPercent(t.priceChangePercent)}</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All pairs table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trading Pairs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Last Price</TableHead>
                <TableHead className="text-right">24h %</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Market Cap</TableHead>
                <TableHead className="text-center hidden lg:table-cell">Last 7 days</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickers.map((t, i) => (
                <TableRow key={t.symbol}>
                  <TableCell className="text-center text-muted-foreground text-xs">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                        {t.baseAsset[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.baseAsset}
                          <span className="text-muted-foreground font-normal text-xs ml-1">{t.baseAsset}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    ${formatPrice(t.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn('text-xs font-semibold', isPositive(t.priceChangePercent) ? 'text-up' : 'text-down')}>
                      {formatPercent(t.priceChangePercent)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">
                    ${formatNumber(t.quoteVolume24h / 1_000_000, 0)}M
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex justify-center">
                      <MiniSparkline
                        data={sparkData(t.price)}
                        color={isPositive(t.priceChangePercent) ? '#0ecb81' : '#f6465d'}
                        height={32}
                        width={80}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/trade/${t.symbol}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150">
                      Trade
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
