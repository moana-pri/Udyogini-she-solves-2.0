"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, LogOut, User, Bell, Home, Search, History, Heart, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface CustomerDashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search Services", icon: Search },
  { id: "bookings", label: "Booking History", icon: History },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "profile", label: "Profile", icon: User },
]

const languages = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "mr", label: "MR" },
]


export function CustomerDashboardHeader({ activeTab, onTabChange }: CustomerDashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  

        const [language, setLanguage] = useState("en")

useEffect(() => {
  const savedLang = localStorage.getItem("language")
  if (savedLang) setLanguage(savedLang)
}, [])


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 animate-fade-in-scale">
          <Image
            src="/images/udyogini-logo.png"
            alt="Udyogini Logo"
            width={44}
            height={44}
            className="rounded-full"
          />
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            UDYOGINI
          </span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">

          <div className="flex items-center gap-1 rounded-lg border p-1">
  {languages.map((lang) => (
    <Button
      key={lang.code}
      size="sm"
      variant={language === lang.code ? "default" : "ghost"}
      onClick={() => {
        setLanguage(lang.code)
        localStorage.setItem("language", lang.code)
        window.location.reload()
      }}
    >
      {lang.label}
    </Button>
  ))}
</div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">AN</AvatarFallback>
                </Avatar>
                <span className="font-medium">Anita</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTabChange("profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
  onSelect={() => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    window.location.href = "/login"
  }}
  className="text-destructive"
>
  <LogOut className="mr-2 h-4 w-4" />
  Sign Out
</DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border/40 bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">AN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">Anita</p>
                <p className="text-sm text-muted-foreground">Customer Account</p>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
  {languages.map((lang) => (
    <Button
      key={lang.code}
      size="sm"
      variant={language === lang.code ? "default" : "outline"}
      className="flex-1"
      onClick={() => {
        setLanguage(lang.code)
        localStorage.setItem("language", lang.code)
        window.location.reload()
      }}
    >
      {lang.label}
    </Button>
  ))}
</div>

            
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMenuOpen(false)
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
            
            <div className="mt-2 border-t border-border pt-2">
              <Link 
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
