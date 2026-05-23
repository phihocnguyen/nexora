import type { Order, PlaceOrderRequest } from './types'
import { MOCK_ORDERS } from './mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getOpenOrders(symbol?: string): Promise<Order[]> {
  if (USE_MOCK) return MOCK_ORDERS.filter(o => o.status === 'NEW' || o.status === 'PARTIALLY_FILLED')
  const { api } = await import('./client')
  const qs = symbol ? `?symbol=${symbol}` : ''
  return api.get('trading', `/api/v1/orders/open${qs}`)
}

export async function getOrderHistory(symbol?: string): Promise<Order[]> {
  if (USE_MOCK) return MOCK_ORDERS
  const { api } = await import('./client')
  const qs = symbol ? `?symbol=${symbol}` : ''
  return api.get('trading', `/api/v1/orders/history${qs}`)
}

export async function placeOrder(req: PlaceOrderRequest): Promise<Order> {
  if (USE_MOCK) {
    return {
      orderId: `ord-${Date.now()}`,
      symbol: req.symbol,
      side: req.side,
      type: req.type,
      status: req.type === 'MARKET' ? 'FILLED' : 'NEW',
      price: req.price ?? 0,
      origQty: req.quantity,
      executedQty: req.type === 'MARKET' ? req.quantity : 0,
      cummulativeQuoteQty: req.type === 'MARKET' ? (req.price ?? 0) * req.quantity : 0,
      timeInForce: req.timeInForce ?? 'GTC',
      time: Date.now(),
      updateTime: Date.now(),
    }
  }
  const { api } = await import('./client')
  return api.post('trading', '/api/v1/orders', req)
}

export async function cancelOrder(symbol: string, orderId: string): Promise<Order> {
  if (USE_MOCK) {
    const order = MOCK_ORDERS.find(o => o.orderId === orderId)
    if (!order) throw new Error('Order not found')
    return { ...order, status: 'CANCELED' }
  }
  const { api } = await import('./client')
  return api.delete('trading', `/api/v1/orders/${orderId}?symbol=${symbol}`)
}
