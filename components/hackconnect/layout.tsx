"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { UserNav } from "@/components/user-nav";
import { Lightbulb, Users, Home } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      title: "Team Members",
      href: "/team-members",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center">
            <Lightbulb className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-semibold tracking-tight">
              SynergySphere
            </span>
          </Link>
        </div>
        <nav className="hidden gap-5 text-sm md:flex">
          {/* Navigation items will be added as needed */}
        </nav>
        <div className="flex items-center gap-4">
          <UserNav
            user={{
              name: "John Smith",
              email: "john@example.com",
              image: "/placeholder.svg?height=32&width=32",
            }}
          />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r md:block">
          <SidebarNavigation items={navigationItems} />
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
