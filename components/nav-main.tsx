"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            // "/analyses/[id]" (hasil analisis) has no dedicated sidebar entry —
            // it's opened from Riwayat Analisis, so treat it as part of that section.
            const isResultPage =
              pathname.startsWith("/analyses/") && !pathname.startsWith("/analyses/new")
            let isActive: boolean
            if (item.url === "/riwayat") {
              isActive = pathname === "/riwayat" || isResultPage
            } else if (item.url === "/") {
              isActive = pathname === "/"
            } else {
              isActive = pathname.startsWith(item.url)
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
