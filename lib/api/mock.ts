import type {
  Ticker, Kline, OrderBook, Trade,
  Order, PortfolioSummary, WalletSummary, Transaction, Notification,
} from './types'

// ── Tickers ───────────────────────────────────────────────────────────────────
export const MOCK_TICKERS: Ticker[] = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 67842.5, priceChange: 1243.2, priceChangePercent: 1.87, high24h: 68500, low24h: 65200, volume24h: 28340, quoteVolume24h: 1_920_000_000, openPrice: 66599.3 },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', price: 3521.8, priceChange: -42.3, priceChangePercent: -1.19, high24h: 3610, low24h: 3480, volume24h: 145200, quoteVolume24h: 510_000_000, openPrice: 3564.1 },
  { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', price: 612.4, priceChange: 8.7, priceChangePercent: 1.44, high24h: 625, low24h: 598, volume24h: 980000, quoteVolume24h: 598_000_000, openPrice: 603.7 },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', price: 178.3, priceChange: -3.2, priceChangePercent: -1.76, high24h: 185, low24h: 172, volume24h: 5_200_000, quoteVolume24h: 928_000_000, openPrice: 181.5 },
  { symbol: 'XRPUSDT', baseAsset: 'XRP', quoteAsset: 'USDT', price: 0.6234, priceChange: 0.0123, priceChangePercent: 2.01, high24h: 0.634, low24h: 0.608, volume24h: 180_000_000, quoteVolume24h: 112_000_000, openPrice: 0.6111 },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT', price: 0.4523, priceChange: -0.0078, priceChangePercent: -1.69, high24h: 0.468, low24h: 0.442, volume24h: 320_000_000, quoteVolume24h: 145_000_000, openPrice: 0.4601 },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT', price: 0.1823, priceChange: 0.0045, priceChangePercent: 2.53, high24h: 0.191, low24h: 0.176, volume24h: 1_200_000_000, quoteVolume24h: 218_000_000, openPrice: 0.1778 },
  { symbol: 'AVAXUSDT', baseAsset: 'AVAX', quoteAsset: 'USDT', price: 38.72, priceChange: -0.83, priceChangePercent: -2.1, high24h: 40.5, low24h: 37.9, volume24h: 4_800_000, quoteVolume24h: 185_000_000, openPrice: 39.55 },
  { symbol: 'LINKUSDT', baseAsset: 'LINK', quoteAsset: 'USDT', price: 17.45, priceChange: 0.32, priceChangePercent: 1.87, high24h: 17.9, low24h: 16.8, volume24h: 12_000_000, quoteVolume24h: 209_000_000, openPrice: 17.13 },
  { symbol: 'MATICUSDT', baseAsset: 'MATIC', quoteAsset: 'USDT', price: 0.8912, priceChange: -0.0234, priceChangePercent: -2.56, high24h: 0.928, low24h: 0.875, volume24h: 280_000_000, quoteVolume24h: 250_000_000, openPrice: 0.9146 },
]

// ── Klines ────────────────────────────────────────────────────────────────────
export function generateKlines(basePrice: number, count = 100): Kline[] {
  const klines: Kline[] = []
  let price = basePrice * 0.9
  const now = Date.now()
  const interval = 4 * 60 * 60 * 1000 // 4h

  for (let i = count; i >= 0; i--) {
    const open = price
    const change = (Math.random() - 0.48) * price * 0.025
    const close = open + change
    const high = Math.max(open, close) * (1 + Math.random() * 0.012)
    const low = Math.min(open, close) * (1 - Math.random() * 0.012)
    const volume = basePrice * (500 + Math.random() * 2000)
    const openTime = now - i * interval

    klines.push({ openTime, open, high, low, close, volume, closeTime: openTime + interval - 1 })
    price = close
  }
  return klines
}

// ── Order Book ────────────────────────────────────────────────────────────────
export function generateOrderBook(price: number): OrderBook {
  const bids = Array.from({ length: 20 }, (_, i) => {
    const p = price * (1 - (i + 1) * 0.0003)
    const qty = Math.random() * 2 + 0.01
    return { price: p, quantity: qty, total: p * qty }
  })
  const asks = Array.from({ length: 20 }, (_, i) => {
    const p = price * (1 + (i + 1) * 0.0003)
    const qty = Math.random() * 2 + 0.01
    return { price: p, quantity: qty, total: p * qty }
  })
  return { symbol: 'BTCUSDT', lastUpdateId: Date.now(), bids, asks }
}

// ── Recent Trades ─────────────────────────────────────────────────────────────
export function generateTrades(price: number, count = 30): Trade[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(Date.now() - i * 1000),
    price: price * (1 + (Math.random() - 0.5) * 0.002),
    quantity: Math.random() * 1.5 + 0.001,
    time: Date.now() - i * 3000,
    isBuyerMaker: Math.random() > 0.5,
  }))
}

// ── Orders ────────────────────────────────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  { orderId: 'ord-001', symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', status: 'FILLED', price: 65000, origQty: 0.05, executedQty: 0.05, cummulativeQuoteQty: 3250, timeInForce: 'GTC', time: Date.now() - 86400000 * 2, updateTime: Date.now() - 86400000 * 2 + 60000 },
  { orderId: 'ord-002', symbol: 'ETHUSDT', side: 'BUY', type: 'LIMIT', status: 'FILLED', price: 3400, origQty: 0.5, executedQty: 0.5, cummulativeQuoteQty: 1700, timeInForce: 'GTC', time: Date.now() - 86400000, updateTime: Date.now() - 86400000 + 30000 },
  { orderId: 'ord-003', symbol: 'SOLUSDT', side: 'SELL', type: 'MARKET', status: 'FILLED', price: 182, origQty: 10, executedQty: 10, cummulativeQuoteQty: 1820, timeInForce: 'IOC', time: Date.now() - 3600000 * 5, updateTime: Date.now() - 3600000 * 5 + 500 },
  { orderId: 'ord-004', symbol: 'BTCUSDT', side: 'SELL', type: 'LIMIT', status: 'NEW', price: 71000, origQty: 0.02, executedQty: 0, cummulativeQuoteQty: 0, timeInForce: 'GTC', time: Date.now() - 3600000, updateTime: Date.now() - 3600000 },
  { orderId: 'ord-005', symbol: 'BNBUSDT', side: 'BUY', type: 'LIMIT', status: 'PARTIALLY_FILLED', price: 605, origQty: 5, executedQty: 2, cummulativeQuoteQty: 1210, timeInForce: 'GTC', time: Date.now() - 1800000, updateTime: Date.now() - 900000 },
]

// ── Portfolio ─────────────────────────────────────────────────────────────────
export const MOCK_PORTFOLIO: PortfolioSummary = {
  totalValue: 42_380.15,
  totalCost: 38_540.00,
  totalPnl: 3_840.15,
  totalPnlPercent: 9.96,
  dailyPnl: 724.32,
  dailyPnlPercent: 1.74,
  positions: [
    { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', quantity: 0.35, avgEntryPrice: 61200, currentPrice: 67842.5, unrealizedPnl: 2324.88, unrealizedPnlPercent: 10.85, value: 23744.88 },
    { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', quantity: 2.5, avgEntryPrice: 3280, currentPrice: 3521.8, unrealizedPnl: 604.5, unrealizedPnlPercent: 7.37, value: 8804.5 },
    { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', quantity: 10, avgEntryPrice: 580, currentPrice: 612.4, unrealizedPnl: 324, unrealizedPnlPercent: 5.59, value: 6124 },
    { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', quantity: 20, avgEntryPrice: 190, currentPrice: 178.3, unrealizedPnl: -234, unrealizedPnlPercent: -6.16, value: 3566 },
    { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT', quantity: 1200, avgEntryPrice: 0.175, currentPrice: 0.1823, unrealizedPnl: 8.76, unrealizedPnlPercent: 4.17, value: 218.76 },
  ],
}

// ── Wallet ────────────────────────────────────────────────────────────────────
export const MOCK_WALLET: WalletSummary = {
  totalUsdtValue: 45_230.58,
  balances: [
    { asset: 'USDT', free: 2850.43, locked: 1210.00, total: 4060.43, usdtValue: 4060.43 },
    { asset: 'BTC', free: 0.35, locked: 0.02, total: 0.37, usdtValue: 25101.73 },
    { asset: 'ETH', free: 2.5, locked: 0, total: 2.5, usdtValue: 8804.5 },
    { asset: 'BNB', free: 10, locked: 0, total: 10, usdtValue: 6124 },
    { asset: 'SOL', free: 20, locked: 0, total: 20, usdtValue: 3566 },
    { asset: 'DOGE', free: 1200, locked: 0, total: 1200, usdtValue: 218.76 },
  ],
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { txId: 'tx-001', type: 'DEPOSIT', asset: 'USDT', amount: 10000, status: 'COMPLETED', time: Date.now() - 86400000 * 7 },
  { txId: 'tx-002', type: 'TRADE', asset: 'BTC', amount: 0.35, status: 'COMPLETED', time: Date.now() - 86400000 * 5 },
  { txId: 'tx-003', type: 'TRADE', asset: 'ETH', amount: 2.5, status: 'COMPLETED', time: Date.now() - 86400000 * 3 },
  { txId: 'tx-004', type: 'WITHDRAWAL', asset: 'USDT', amount: 500, status: 'COMPLETED', time: Date.now() - 86400000 * 2, address: '0xabc...def', txHash: '0x123...456' },
  { txId: 'tx-005', type: 'DEPOSIT', asset: 'BNB', amount: 10, status: 'COMPLETED', time: Date.now() - 86400000 },
  { txId: 'tx-006', type: 'FEE', asset: 'BNB', amount: -0.1, status: 'COMPLETED', time: Date.now() - 3600000 * 6 },
  { txId: 'tx-007', type: 'WITHDRAWAL', asset: 'ETH', amount: 0.5, status: 'PENDING', time: Date.now() - 3600000, address: '0xdef...abc' },
]

// ── Notifications ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n-001', type: 'ORDER_FILLED', title: 'Order Filled', message: 'Your BUY order for 0.05 BTC at $65,000 has been filled.', read: false, time: Date.now() - 86400000 * 2 },
  { id: 'n-002', type: 'ORDER_FILLED', title: 'Order Filled', message: 'Your BUY order for 0.5 ETH at $3,400 has been filled.', read: false, time: Date.now() - 86400000 },
  { id: 'n-003', type: 'PRICE_ALERT', title: 'Price Alert: BTC', message: 'Bitcoin (BTC) has risen above $67,000.', read: false, time: Date.now() - 3600000 * 3 },
  { id: 'n-004', type: 'DEPOSIT', title: 'Deposit Confirmed', message: 'Your deposit of 10 BNB has been confirmed.', read: true, time: Date.now() - 86400000 },
  { id: 'n-005', type: 'WITHDRAWAL', title: 'Withdrawal Submitted', message: 'Your withdrawal of 0.5 ETH is being processed.', read: true, time: Date.now() - 3600000 },
  { id: 'n-006', type: 'ORDER_CANCELED', title: 'Order Canceled', message: 'Your SELL order for 2 SOL at $185 was canceled.', read: true, time: Date.now() - 7200000 },
  { id: 'n-007', type: 'SYSTEM', title: 'System Maintenance', message: 'Scheduled maintenance on May 25, 2026 at 02:00 UTC. Estimated downtime: 30 minutes.', read: true, time: Date.now() - 86400000 * 3 },
]
