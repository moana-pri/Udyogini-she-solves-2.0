"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Star, 
  User,
  LogOut,
  X
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface BusinessSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "profile", label: "Profile", icon: User },
]

export function BusinessSidebar({ activeSection, onSectionChange, isOpen, onClose }: BusinessSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:sticky md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/business/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">U</span>
            </div>
            <span 
              className="text-lg font-bold tracking-tight text-sidebar-foreground"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              UDYOGINI
            </span>
          </Link>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-sidebar-accent md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Business Profile Summary */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">PM</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-sidebar-foreground">{"Priya's Beauty Parlour"}</p>
              <p className="text-xs text-sidebar-foreground/60">Beauty Parlour</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  )
}
