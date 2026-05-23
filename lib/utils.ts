import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCurrency(value: number, currency = 'USDT'): string {
  return `${formatNumber(value)} ${currency}`
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatNumber(value)}%`
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, 2)}B`
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 2)}M`
  if (value >= 1_000) return `${formatNumber(value / 1_000, 2)}K`
  return formatNumber(value)
}

export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatPrice(price: number): string {
  if (price >= 1000) return formatNumber(price, 2)
  if (price >= 1) return formatNumber(price, 4)
  return formatNumber(price, 6)
}

export function isPositive(value: number): boolean {
  return value >= 0
}
