import type React from "react"
import "@/app/globals.css"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "HackThisIdea",
  description: "Generate and build amazing hackathon projects",
  generator: 'vercel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", GeistSans.variable, GeistMono.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}