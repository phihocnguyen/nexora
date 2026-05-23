import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react'
import { getWallet, getTransactions } from '@/lib/api/wallet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WalletActions } from '@/components/wallet/WalletActions'
import { formatNumber, formatTime, cn } from '@/lib/utils'
import type { Transaction } from '@/lib/api/types'

export const metadata = { title: 'Wallet — Nexora' }

const TX_VARIANT: Record<Transaction['status'], 'success' | 'warning' | 'destructive'> = {
  COMPLETED: 'success',
  PENDING: 'warning',
  FAILED: 'destructive',
}

const TX_ICON: Record<Transaction['type'], React.ReactNode> = {
  DEPOSIT: <ArrowDownToLine className="size-3.5 text-up" />,
  WITHDRAWAL: <ArrowUpFromLine className="size-3.5 text-down" />,
  TRADE: <RefreshCw className="size-3.5 text-muted-foreground" />,
  FEE: <RefreshCw className="size-3.5 text-muted-foreground" />,
}

export default async function WalletPage() {
  const [wallet, transactions] = await Promise.all([getWallet(), getTransactions()])

  const nonZero = wallet.balances.filter(b => b.total > 0)

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <h1 className="text-lg font-bold">Wallet</h1>

      {/* Total balance */}
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground">Estimated Balance</p>
          <p className="text-3xl font-bold mt-1">{formatNumber(wallet.totalUsdtValue)} <span className="text-lg text-muted-foreground">USDT</span></p>
          <div className="flex gap-3 mt-4">
            <WalletActions />
          </div>
        </CardContent>
      </Card>

      {/* Balance cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {nonZero.map(b => (
          <Card key={b.asset} className="hover:border-border/80 transition-colors">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                  {b.asset[0]}
                </div>
                <span className="text-xs font-semibold text-foreground">{b.asset}</span>
              </div>
              <p className="text-sm font-bold">{formatNumber(b.free, b.free < 1 ? 6 : 2)}</p>
              {b.locked > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Locked: {formatNumber(b.locked, b.locked < 1 ? 6 : 4)}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${formatNumber(b.usdtValue)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Balances table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Balances</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">In Orders</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Value (USDT)</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonZero.map(b => {
                const pct = (b.usdtValue / wallet.totalUsdtValue) * 100
                return (
                  <TableRow key={b.asset}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {b.asset[0]}
                        </div>
                        <span className="font-semibold">{b.asset}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(b.free, b.free < 1 ? 6 : 4)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatNumber(b.locked, b.locked < 1 ? 6 : 4)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">{formatNumber(b.total, b.total < 1 ? 6 : 4)}</TableCell>
                    <TableCell className="text-right font-mono font-medium">${formatNumber(b.usdtValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{formatNumber(pct, 1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Address / Hash</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => (
                <TableRow key={tx.txId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {TX_ICON[tx.type]}
                      <span className="text-sm">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {tx.asset[0]}
                      </div>
                      <span className="font-medium">{tx.asset}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-mono font-medium',
                    tx.amount > 0 ? 'text-up' : 'text-down',
                  )}>
                    {tx.amount > 0 ? '+' : ''}{formatNumber(tx.amount, tx.amount < 1 ? 6 : 2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={TX_VARIANT[tx.status]}>{tx.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground font-mono">
                    {tx.address ?? tx.txHash ?? '—'}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatTime(tx.time)}
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
