'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { GripVertical, GripHorizontal } from 'lucide-react'

// ── Horizontal resize handle ────────────────────────────────────────────────
interface HResizeHandleProps {
  onResize: (delta: number) => void
  className?: string
}

export function HResizeHandle({ onResize, className }: HResizeHandleProps) {
  const dragging = useRef(false)
  const lastX = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    lastX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const delta = e.clientX - lastX.current
    lastX.current = e.clientX
    onResize(delta)
  }, [onResize])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        'group relative flex items-center justify-center w-1.5 shrink-0 cursor-col-resize',
        'bg-border hover:bg-primary/60 transition-colors duration-150 select-none',
        'active:bg-primary',
        className,
      )}
      title="Drag to resize"
    >
      <GripVertical className="size-3 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 absolute" />
    </div>
  )
}

// ── Vertical resize handle ──────────────────────────────────────────────────
interface VResizeHandleProps {
  onResize: (delta: number) => void
  className?: string
}

export function VResizeHandle({ onResize, className }: VResizeHandleProps) {
  const dragging = useRef(false)
  const lastY = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    lastY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const delta = e.clientY - lastY.current
    lastY.current = e.clientY
    onResize(delta)
  }, [onResize])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        'group relative flex items-center justify-center h-1.5 shrink-0 cursor-row-resize',
        'bg-border hover:bg-primary/60 transition-colors duration-150 select-none w-full',
        'active:bg-primary',
        className,
      )}
      title="Drag to resize"
    >
      <GripHorizontal className="size-3 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 absolute" />
    </div>
  )
}
