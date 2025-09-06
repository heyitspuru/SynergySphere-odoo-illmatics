"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navigation, MobileNavigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:grid lg:grid-cols-5">
        {/* Sidebar Navigation - Desktop */}
        <div className="hidden lg:block lg:col-span-1 lg:border-r">
          <div className="sticky top-0 h-screen">
            <Navigation />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          {/* Mobile Header */}
          <div className="lg:hidden border-b">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2">
                <MobileNavigation />
                <h1 className="font-semibold">{title || "SynergySphere"}</h1>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}