import type React from "react";
import "@/app/globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProviderWrapper from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "SynergySphere",
  description:
    "Advanced Team Collaboration Platform - Streamline tasks, communication, and team productivity",
  generator: "vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <SessionProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
