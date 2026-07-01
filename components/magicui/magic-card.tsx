"use client"

import React, { useRef } from "react"
import { cn } from "@/lib/utils"

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
}

export function MagicCard({
  children,
  className,
  gradientSize = 300,
  gradientColor = "oklch(var(--primary) / 0.12)",
  gradientOpacity = 0.8,
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/75 backdrop-blur-md text-card-foreground shadow-lg transition-colors duration-300",
        className
      )}
      style={
        {
          "--gradient-size": `${gradientSize}px`,
          "--gradient-color": gradientColor,
          "--gradient-opacity": gradientOpacity,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Interactive Spotlight Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(var(--gradient-size) circle at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--gradient-color), transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}
