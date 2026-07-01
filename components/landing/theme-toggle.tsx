"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label="Ganti tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground backdrop-blur transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
    >
      {mounted && isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      <span className="sr-only">Ganti tema</span>
    </button>
  )
}
