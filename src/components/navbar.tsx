"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center">
          <div className="flex gap-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/traffic-lights"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/traffic-lights" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Traffic Lights
            </Link>
            <Link
              href="/alerts"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/alerts" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Alerts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 