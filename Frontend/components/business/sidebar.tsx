"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
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
import { EnhancedLanguageSelector } from "@/components/ui/enhanced-language-selector"
import { useLanguage } from "@/lib/enhanced-language-context"

interface BusinessSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { id: "overview", label: "dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "bookings", icon: Calendar },
  { id: "customers", label: "customers", icon: Users },
  { id: "reviews", label: "reviews", icon: Star },
  { id: "profile", label: "profile", icon: User },
]

export function BusinessSidebar({ activeSection, onSectionChange, isOpen, onClose }: BusinessSidebarProps) {
  const [businessProfile, setBusinessProfile] = useState({
    businessName: "UDYOGINI",
    ownerName: "Owner",
    initials: "U"
  })
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/business/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const businessName = data.businessName || "UDYOGINI"
          const ownerName = data.ownerName || data.ownerId?.fullName || "Owner"
          const initials = businessName
            .split(" ")
            .map((word: string) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()

          setBusinessProfile({
            businessName,
            ownerName,
            initials
          })
          console.log('Business profile loaded:', { businessName, ownerName })
        } else {
          console.error('Failed to fetch business profile:', response.status)
        }
      } catch (error) {
        console.error("Error fetching business profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinessProfile()
  }, [])

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
              <span className="text-sm font-bold text-primary-foreground">{businessProfile.initials}</span>
            </div>
            <span 
              className="text-lg font-bold tracking-tight text-sidebar-foreground"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {businessProfile.businessName.substring(0, 12)}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <EnhancedLanguageSelector />
            <button 
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-sidebar-accent md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Business Profile Summary */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">{businessProfile.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-sidebar-foreground">{businessProfile.businessName}</p>
              <p className="text-xs text-sidebar-foreground/60">{businessProfile.ownerName}</p>
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
              {t(item.label)}
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
            {t('logout')}
          </Link>
        </div>
      </aside>
    </>
  )
}
