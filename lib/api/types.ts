// ── Market Service ────────────────────────────────────────────────────────────
export interface Ticker {
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  priceChange: number
  priceChangePercent: number
  high24h: number
  low24h: number
  volume24h: number
  quoteVolume24h: number
  openPrice: number
}

export interface Kline {
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}

export interface OrderBook {
  symbol: string
  lastUpdateId: number
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export interface Trade {
  id: string
  price: number
  quantity: number
  time: number
  isBuyerMaker: boolean
}

// ── Trading Service ───────────────────────────────────────────────────────────
export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT'
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED'
export type TimeInForce = 'GTC' | 'IOC' | 'FOK'

export interface Order {
  orderId: string
  symbol: string
  side: OrderSide
  type: OrderType
  status: OrderStatus
  price: number
  origQty: number
  executedQty: number
  cummulativeQuoteQty: number
  timeInForce: TimeInForce
  time: number
  updateTime: number
}

export interface PlaceOrderRequest {
  symbol: string
  side: OrderSide
  type: OrderType
  price?: number
  quantity: number
  timeInForce?: TimeInForce
}

// ── Portfolio Service ─────────────────────────────────────────────────────────
export interface Position {
  symbol: string
  baseAsset: string
  quoteAsset: string
  quantity: number
  avgEntryPrice: number
  currentPrice: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  value: number
}

export interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalPnl: number
  totalPnlPercent: number
  dailyPnl: number
  dailyPnlPercent: number
  positions: Position[]
}

// ── Wallet Service ────────────────────────────────────────────────────────────
export interface Balance {
  asset: string
  free: number
  locked: number
  total: number
  usdtValue: number
}

export interface WalletSummary {
  totalUsdtValue: number
  balances: Balance[]
}

export interface Transaction {
  txId: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE' | 'FEE'
  asset: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  time: number
  address?: string
  txHash?: string
}

// ── Notification Service ──────────────────────────────────────────────────────
export type NotificationType = 'ORDER_FILLED' | 'ORDER_CANCELED' | 'DEPOSIT' | 'WITHDRAWAL' | 'PRICE_ALERT' | 'SYSTEM'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  time: number
  data?: Record<string, unknown>
}
