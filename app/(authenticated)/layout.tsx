"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { NotificationCenter } from "@/components/synergysphere/notification-center";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderOpen,
  CheckSquare,
  Users,
  Settings,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderOpen,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      label: "Team",
      href: "/team-members",
      icon: Users,
    },
  ];

  const bottomNavItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: UserCircle,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
                  SynergySphere
                </h1>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}

              <Separator className="my-4" />

              {bottomNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Bottom section */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <NotificationCenter />
                  <UserNav
                    user={{
                      name: session.user.name || "User",
                      email: session.user.email || "",
                      image: session.user.image || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-72 flex-1">
          <main className="min-h-screen">{children}</main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/dashboard">
              <h1 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                SynergySphere
              </h1>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationCenter />
              <UserNav
                user={{
                  name: session.user.name || "User",
                  email: session.user.email || "",
                  image: session.user.image || "",
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen pb-20">{children}</main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
          <nav className="flex items-center justify-around py-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col gap-1 h-12"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
