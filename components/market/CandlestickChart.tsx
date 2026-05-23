'use client'

import { useEffect, useRef } from 'react'
import {
  createChart, ColorType, CrosshairMode,
  CandlestickSeries, HistogramSeries,
} from 'lightweight-charts'
import type { IChartApi } from 'lightweight-charts'
import type { Kline } from '@/lib/api/types'

interface CandlestickChartProps {
  klines: Kline[]
  height?: number
  /** If true the chart fills its container's height via ResizeObserver */
  fillContainer?: boolean
}

export function CandlestickChart({ klines, height = 380, fillContainer = false }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef     = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!containerRef.current || klines.length === 0) return

    const el = containerRef.current
    const h  = fillContainer ? (el.clientHeight || height) : height

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8a7060',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#2e2018' },
        horzLines: { color: '#2e2018' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#8a7060', labelBackgroundColor: '#2e2018' },
        horzLine: { color: '#8a7060', labelBackgroundColor: '#2e2018' },
      },
      rightPriceScale: { borderColor: '#2e2018' },
      timeScale: {
        borderColor: '#2e2018',
        timeVisible: true,
        secondsVisible: false,
      },
      width:  el.clientWidth,
      height: h,
    })

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:        '#0ecb81',
      downColor:      '#f6465d',
      borderUpColor:  '#0ecb81',
      borderDownColor:'#f6465d',
      wickUpColor:    '#0ecb81',
      wickDownColor:  '#f6465d',
    })

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    })

    type ChartTime = Parameters<typeof candleSeries.setData>[0][number]['time']

    const candles = klines.map(k => ({
      time:  Math.floor(k.openTime / 1000) as ChartTime,
      open:  k.open, high: k.high, low: k.low, close: k.close,
    }))
    const volumes = klines.map(k => ({
      time:  Math.floor(k.openTime / 1000) as ChartTime,
      value: k.volume,
      color: k.close >= k.open ? '#0ecb8133' : '#f6465d33',
    }))

    candleSeries.setData(candles)
    volumeSeries.setData(volumes)
    chart.timeScale().fitContent()
    chartRef.current = chart

    // Resize observer handles both window resize and container dimension changes
    const ro = new ResizeObserver(() => {
      if (!el) return
      const newH = fillContainer ? el.clientHeight : height
      chart.applyOptions({ width: el.clientWidth, height: newH })
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [klines, height, fillContainer])

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={fillContainer ? { height: '100%' } : { height }}
    />
  )
}
