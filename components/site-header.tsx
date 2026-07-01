"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function crumbsForPathname(pathname: string): { label: string; href: string }[] {
  const dashboard = { label: "Dashboard", href: "/" }
  const riwayat = { label: "Riwayat Analisis", href: "/riwayat" }

  if (pathname === "/") return [dashboard]
  if (pathname === "/riwayat") return [dashboard, riwayat]
  if (pathname === "/analyses/new") return [dashboard, { label: "Analisis Baru", href: pathname }]
  if (pathname.startsWith("/analyses/")) return [dashboard, riwayat, { label: "Hasil Analisis", href: pathname }]

  return [dashboard]
}

export function SiteHeader() {
  const pathname = usePathname()
  const crumbs = crumbsForPathname(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 shrink-0 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              return (
                <Fragment key={crumb.href}>
                  {/* earlier crumbs are hidden on mobile so the header never wraps to a second line */}
                  <span className={cn(!isLast && "hidden sm:contents")}>
                    <BreadcrumbItem className="min-w-0">
                      {isLast ? (
                        <BreadcrumbPage className="truncate text-sm font-medium text-foreground sm:text-base">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href} className="whitespace-nowrap">
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </span>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
