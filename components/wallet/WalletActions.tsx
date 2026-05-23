'use client'

import { useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { deposit, withdraw } from '@/lib/api/wallet'

const ASSETS = ['BTC', 'ETH', 'BNB', 'SOL', 'USDT']

export function WalletActions() {
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [asset, setAsset] = useState('USDT')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleDeposit = async () => {
    setLoading(true)
    try {
      const res = await deposit(asset, parseFloat(amount) || 0)
      setResult(`Send ${asset} to: ${res.address}`)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    setLoading(true)
    try {
      const res = await withdraw(asset, parseFloat(amount) || 0, address)
      setResult(`Withdrawal submitted! TX ID: ${res.txId}`)
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => { setAmount(''); setAddress(''); setResult(null) }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => { resetModal(); setDepositOpen(true) }}
      >
        <ArrowDownToLine className="size-3.5" />
        Deposit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => { resetModal(); setWithdrawOpen(true) }}
      >
        <ArrowUpFromLine className="size-3.5" />
        Withdraw
      </Button>

      {/* Deposit dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Crypto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={asset} onValueChange={v => { if (v) setAsset(v) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ASSETS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              label="Amount (optional)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              suffix={asset}
            />
            {result
              ? <div className="rounded-md bg-[#0ecb81]/10 border border-[#0ecb81]/30 p-3 text-sm text-[#0ecb81] font-mono break-all">{result}</div>
              : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositOpen(false)}>Cancel</Button>
            <Button onClick={handleDeposit} loading={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Crypto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={asset} onValueChange={v => { if (v) setAsset(v) }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ASSETS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              label="Wallet Address"
              placeholder="0x... or bc1..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              suffix={asset}
            />
            {result
              ? <div className="rounded-md bg-[#0ecb81]/10 border border-[#0ecb81]/30 p-3 text-sm text-[#0ecb81] break-all">{result}</div>
              : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button
              onClick={handleWithdraw}
              loading={loading}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={!address || !amount}
            >
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
