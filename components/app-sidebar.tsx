"use client"

import * as React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, HistoryIcon, PlusIcon, ShieldAlertIcon } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ name: string; email: string; avatar: string }>({
    name: "Admin",
    email: "admin@derang.com",
    avatar: "",
  })

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          name: user.user_metadata?.name || user.email?.split("@")[0] || "Admin",
          email: user.email || "admin@derang.com",
          avatar: "",
        })
      }
    })
  }, [])

  const navItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Riwayat Analisis",
      url: "/riwayat",
      icon: <HistoryIcon />,
    },
    {
      title: "Analisis Baru",
      url: "/analyses/new",
      icon: <PlusIcon />,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <ShieldAlertIcon className="size-5! text-primary" />
                <span className="text-base font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  DERANG
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
