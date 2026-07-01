import React from "react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export function BorderBeam({
  className,
  size = 150,
  duration = 10,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "oklch(var(--primary))",
  colorTo = "oklch(var(--primary) / 0.1)",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--anchor": `${anchor}`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        className
      )}
    >
      <div
        className="animate-border-beam absolute aspect-square w-[var(--size)] rounded-full bg-gradient-to-r from-[var(--color-from)] to-[var(--color-to)] [offset-anchor:var(--anchor)%_50%] [offset-path:rect(0_100%_100%_0_round_var(--border-width))]"
        style={{
          animationDelay: "var(--delay)",
        }}
      />
    </div>
  )
}
