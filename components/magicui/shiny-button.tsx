import React from "react"
import { cn } from "@/lib/utils"

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function ShinyButton({
  children,
  className,
  disabled,
  ...props
}: ShinyButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "group relative overflow-hidden rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_oklch(var(--primary)/0.3)] focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Shimmer Effect */}
      <span className="absolute inset-0 block h-full w-full bg-[linear-gradient(110deg,transparent,35%,rgba(255,255,255,0.25),45%,rgba(255,255,255,0.25),55%,transparent,65%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:animate-shimmer group-hover:opacity-100" />
      
      {/* Inner reflection glow */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      
      {/* Text/Content */}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}
