import type { PortfolioSummary } from './types'
import { MOCK_PORTFOLIO } from './mock'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'

export async function getPortfolio(): Promise<PortfolioSummary> {
  if (USE_MOCK) return MOCK_PORTFOLIO
  const { api } = await import('./client')
  return api.get('portfolio', '/api/v1/portfolio')
}
