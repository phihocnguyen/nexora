import type { Ticker, Kline, OrderBook, Trade } from './types'
import { MOCK_TICKERS, generateKlines, generateOrderBook, generateTrades } from './mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getTickers(): Promise<Ticker[]> {
  if (USE_MOCK) return MOCK_TICKERS
  const { api } = await import('./client')
  return api.get('market', '/api/v1/tickers')
}

export async function getTicker(symbol: string): Promise<Ticker> {
  if (USE_MOCK) {
    const ticker = MOCK_TICKERS.find(t => t.symbol === symbol)
    if (!ticker) throw new Error(`Ticker ${symbol} not found`)
    return ticker
  }
  const { api } = await import('./client')
  return api.get('market', `/api/v1/tickers/${symbol}`)
}

export async function getKlines(symbol: string, interval = '4h', limit = 100): Promise<Kline[]> {
  if (USE_MOCK) {
    const ticker = MOCK_TICKERS.find(t => t.symbol === symbol)
    return generateKlines(ticker?.price ?? 100, limit)
  }
  const { api } = await import('./client')
  return api.get('market', `/api/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
}

export async function getOrderBook(symbol: string): Promise<OrderBook> {
  if (USE_MOCK) {
    const ticker = MOCK_TICKERS.find(t => t.symbol === symbol)
    return generateOrderBook(ticker?.price ?? 100)
  }
  const { api } = await import('./client')
  return api.get('market', `/api/v1/depth?symbol=${symbol}`)
}

export async function getRecentTrades(symbol: string, limit = 30): Promise<Trade[]> {
  if (USE_MOCK) {
    const ticker = MOCK_TICKERS.find(t => t.symbol === symbol)
    return generateTrades(ticker?.price ?? 100, limit)
  }
  const { api } = await import('./client')
  return api.get('market', `/api/v1/trades?symbol=${symbol}&limit=${limit}`)
}
