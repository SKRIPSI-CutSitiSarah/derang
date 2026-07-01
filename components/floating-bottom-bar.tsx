"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboardIcon, HistoryIcon, PlusIcon } from "lucide-react"

const SIDE_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Riwayat", url: "/riwayat", icon: HistoryIcon },
]

const NEW_ANALYSIS_ITEM = { title: "Analisis Baru", url: "/analyses/new", icon: PlusIcon }

export function FloatingBottomBar() {
  const pathname = usePathname()
  const isResultPage = pathname.startsWith("/analyses/") && !pathname.startsWith("/analyses/new")
  const isNewAnalysisActive = pathname.startsWith(NEW_ANALYSIS_ITEM.url)

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 lg:hidden"
    >
      <div className="flex items-center gap-0.5 rounded-full border bg-card/95 p-1 shadow-lg backdrop-blur-md supports-backdrop-filter:bg-card/80">
        <SideNavLink item={SIDE_ITEMS[0]} isActive={pathname === "/dashboard"} />

        <Link
          href={NEW_ANALYSIS_ITEM.url}
          aria-current={isNewAnalysisActive ? "page" : undefined}
          aria-label={NEW_ANALYSIS_ITEM.title}
          className={cn(
            "-my-2 mx-1 flex size-11 items-center justify-center rounded-full text-primary-foreground shadow-md shadow-primary/30 ring-3 ring-background transition-transform",
            isNewAnalysisActive
              ? "bg-primary scale-105"
              : "bg-primary hover:scale-105 hover:brightness-110"
          )}
        >
          <PlusIcon className="size-5" strokeWidth={2.5} />
        </Link>

        <SideNavLink
          item={SIDE_ITEMS[1]}
          isActive={pathname === "/riwayat" || isResultPage}
        />
      </div>
    </nav>
  )
}

function SideNavLink({
  item,
  isActive,
}: {
  item: { title: string; url: string; icon: typeof PlusIcon }
  isActive: boolean
}) {
  return (
    <Link
      href={item.url}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon className="size-4" />
      <span>{item.title}</span>
    </Link>
  )
}
