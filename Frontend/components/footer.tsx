import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-primary-foreground">U</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                UDYOGINI
              </span>
            </Link>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Empowering women entrepreneurs and connecting them with local customers. Building stronger communities, one business at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/register/business" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Register Business
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Services</h4>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">Tailoring & Fashion</li>
              <li className="text-sm text-muted-foreground">Home Food & Catering</li>
              <li className="text-sm text-muted-foreground">Mehendi & Beauty</li>
              <li className="text-sm text-muted-foreground">Handicrafts & Art</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 fill-primary text-primary" /> for women entrepreneurs
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UDYOGINI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
