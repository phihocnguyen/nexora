import type { WalletSummary, Transaction } from './types'
import { MOCK_WALLET, MOCK_TRANSACTIONS } from './mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getWallet(): Promise<WalletSummary> {
  if (USE_MOCK) return MOCK_WALLET
  const { api } = await import('./client')
  return api.get('wallet', '/api/v1/wallet')
}

export async function getTransactions(): Promise<Transaction[]> {
  if (USE_MOCK) return MOCK_TRANSACTIONS
  const { api } = await import('./client')
  return api.get('wallet', '/api/v1/wallet/transactions')
}

export async function deposit(asset: string, amount: number): Promise<{ address: string }> {
  if (USE_MOCK) return { address: `mock-deposit-address-${asset}` }
  const { api } = await import('./client')
  return api.post('wallet', '/api/v1/wallet/deposit', { asset, amount })
}

export async function withdraw(asset: string, amount: number, address: string): Promise<{ txId: string }> {
  if (USE_MOCK) return { txId: `tx-${Date.now()}` }
  const { api } = await import('./client')
  return api.post('wallet', '/api/v1/wallet/withdraw', { asset, amount, address })
}
