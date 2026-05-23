'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, LineSeries } from 'lightweight-charts'

interface MiniSparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function MiniSparkline({
  data,
  color = '#e07b28',
  height = 56,
  width = 120,
}: MiniSparklineProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || data.length === 0) return

    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'transparent',
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      timeScale: { visible: false, borderVisible: false },
      handleScroll: false,
      handleScale: false,
      width,
      height,
    })

    const series = chart.addSeries(LineSeries, {
      color,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
    })

    const now = Math.floor(Date.now() / 1000)
    series.setData(
      data.map((v, i) => ({
        time: (now - (data.length - i) * 3600) as Parameters<typeof series.setData>[0][number]['time'],
        value: v,
      })),
    )

    chart.timeScale().fitContent()

    return () => { chart.remove() }
  }, [data, color, height, width])

  return <div ref={ref} style={{ width, height }} />
}
