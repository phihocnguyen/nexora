import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { getPortfolio } from '@/lib/api/portfolio'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumber, formatPercent, formatPrice, formatCurrency, isPositive, cn } from '@/lib/utils'

export const metadata = { title: 'Portfolio — Nexora' }

export default async function PortfolioPage() {
  const portfolio = await getPortfolio()

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <h1 className="text-lg font-bold">Portfolio</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold mt-1">${formatNumber(portfolio.totalValue)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">USDT</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total PnL</p>
            <p className={cn('text-xl font-bold mt-1', isPositive(portfolio.totalPnl) ? 'text-up' : 'text-down')}>
              {isPositive(portfolio.totalPnl) ? '+' : ''}${formatNumber(portfolio.totalPnl)}
            </p>
            <Badge variant={isPositive(portfolio.totalPnlPercent) ? 'success' : 'destructive'} className="mt-1">
              {formatPercent(portfolio.totalPnlPercent)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">24h PnL</p>
            <p className={cn('text-xl font-bold mt-1', isPositive(portfolio.dailyPnl) ? 'text-up' : 'text-down')}>
              {isPositive(portfolio.dailyPnl) ? '+' : ''}${formatNumber(portfolio.dailyPnl)}
            </p>
            <Badge variant={isPositive(portfolio.dailyPnlPercent) ? 'success' : 'destructive'} className="mt-1">
              {formatPercent(portfolio.dailyPnlPercent)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-xl font-bold mt-1">${formatNumber(portfolio.totalCost)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">USDT invested</p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            {portfolio.positions.map((pos, i) => {
              const pct = (pos.value / portfolio.totalValue) * 100
              const colors = ['#f0b90b', '#0ecb81', '#1890ff', '#f6465d', '#a78bfa', '#fb923c']
              return (
                <div
                  key={pos.symbol}
                  style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }}
                  title={`${pos.baseAsset}: ${formatNumber(pct)}%`}
                />
              )
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            {portfolio.positions.map((pos, i) => {
              const pct = (pos.value / portfolio.totalValue) * 100
              const colors = ['#f0b90b', '#0ecb81', '#1890ff', '#f6465d', '#a78bfa', '#fb923c']
              return (
                <div key={pos.symbol} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-foreground font-medium">{pos.baseAsset}</span>
                  <span className="text-muted-foreground">{formatNumber(pct)}%</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Position cards (mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:hidden">
        {portfolio.positions.map(pos => (
          <Card key={pos.symbol}>
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {pos.baseAsset[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{pos.baseAsset}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(pos.quantity, 4)} units</p>
                  </div>
                </div>
                <Badge variant={isPositive(pos.unrealizedPnlPercent) ? 'success' : 'destructive'}>
                  {formatPercent(pos.unrealizedPnlPercent)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Value</p>
                  <p className="font-medium">${formatNumber(pos.value)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">PnL</p>
                  <p className={cn('font-medium', isPositive(pos.unrealizedPnl) ? 'text-up' : 'text-down')}>
                    {isPositive(pos.unrealizedPnl) ? '+' : ''}${formatNumber(pos.unrealizedPnl)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Entry</p>
                  <p className="font-medium">{formatPrice(pos.avgEntryPrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-medium">{formatPrice(pos.currentPrice)}</p>
                </div>
              </div>
              <Link href={`/trade/${pos.symbol}`}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                Trade <ArrowUpRight className="size-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Positions table (desktop) */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Holdings</TableHead>
                <TableHead className="text-right">Avg. Entry</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Value (USDT)</TableHead>
                <TableHead className="text-right">Unrealized PnL</TableHead>
                <TableHead className="text-right">PnL %</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.positions.map(pos => (
                <TableRow key={pos.symbol}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {pos.baseAsset[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{pos.baseAsset}</p>
                        <p className="text-xs text-muted-foreground">{pos.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatNumber(pos.quantity, 4)}</TableCell>
                  <TableCell className="text-right font-mono">{formatPrice(pos.avgEntryPrice)}</TableCell>
                  <TableCell className="text-right font-mono">{formatPrice(pos.currentPrice)}</TableCell>
                  <TableCell className="text-right font-mono font-medium">${formatNumber(pos.value)}</TableCell>
                  <TableCell className={cn('text-right font-mono font-medium', isPositive(pos.unrealizedPnl) ? 'text-up' : 'text-down')}>
                    {isPositive(pos.unrealizedPnl) ? '+' : ''}${formatNumber(pos.unrealizedPnl)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isPositive(pos.unrealizedPnlPercent)
                        ? <TrendingUp className="size-3 text-up" />
                        : <TrendingDown className="size-3 text-down" />}
                      <Badge variant={isPositive(pos.unrealizedPnlPercent) ? 'success' : 'destructive'}>
                        {formatPercent(pos.unrealizedPnlPercent)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/trade/${pos.symbol}`}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
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
