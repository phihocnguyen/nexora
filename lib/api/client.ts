const SERVICES = {
  market: process.env.NEXT_PUBLIC_MARKET_SERVICE_URL ?? 'http://localhost:8081',
  trading: process.env.NEXT_PUBLIC_TRADING_SERVICE_URL ?? 'http://localhost:8082',
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_SERVICE_URL ?? 'http://localhost:8083',
  wallet: process.env.NEXT_PUBLIC_WALLET_SERVICE_URL ?? 'http://localhost:8084',
  notification: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL ?? 'http://localhost:8085',
}

async function request<T>(
  service: keyof typeof SERVICES,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${SERVICES[service]}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`[${service}] ${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(service: keyof typeof SERVICES, path: string) =>
    request<T>(service, path),
  post: <T>(service: keyof typeof SERVICES, path: string, body: unknown) =>
    request<T>(service, path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(service: keyof typeof SERVICES, path: string, body: unknown) =>
    request<T>(service, path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(service: keyof typeof SERVICES, path: string) =>
    request<T>(service, path, { method: 'DELETE' }),
}
