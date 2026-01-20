"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/common/language-switcher"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 animate-fade-in-scale">
          <Image
            src="/images/udyogini-logo.png"
            alt="Udyogini - Empowering Women. Enabling Growth."
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
            priority
          />
          <span className="font-serif text-xl font-bold tracking-tight text-foreground md:text-2xl">
            UDYOGINI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link 
            href="/" 
            className="text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            About
          </Link>
          <LanguageSwitcher />
          <Link href="/login">
            <Button 
              variant="outline" 
              className="btn-hover-scale rounded-full border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Login
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="animate-fade-in border-t border-border/40 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link 
              href="/" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <LanguageSwitcher />
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant="outline" 
                className="w-full rounded-full border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
