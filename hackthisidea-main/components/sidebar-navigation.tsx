"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"

interface MenuItem {
  title: string
  href: string
  icon?: React.ReactNode
  submenu?: { title: string; href: string }[]
}

interface SidebarNavigationProps {
  items: MenuItem[]
}

export function SidebarNavigation({ items }: SidebarNavigationProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-2 p-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const hasSubmenu = item.submenu && item.submenu.length > 0

          return (
            <div key={item.href} className="flex flex-col">
              {hasSubmenu ? (
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                    isActive && "bg-muted"
                  )}
                  onClick={() => setOpenSubmenu(openSubmenu === item.href ? null : item.href)}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </div>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", openSubmenu === item.href && "rotate-180")}
                  />
                </Button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                    isActive && "bg-muted"
                  )}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </Link>
              )}
              {hasSubmenu && openSubmenu === item.href && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.submenu?.map((subitem) => {
                    const isSubActive = pathname === subitem.href
                    return (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm font-medium hover:bg-muted",
                          isSubActive && "bg-muted"
                        )}
                      >
                        {subitem.title}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
} 