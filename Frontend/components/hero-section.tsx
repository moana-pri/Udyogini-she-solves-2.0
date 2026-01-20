import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Store, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-peach/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-lavender/30 blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="animate-fade-in mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Women Empowerment Platform
            </span>
            
            <h1 className="animate-fade-in-up mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="text-balance">Empowering Women,</span>
              <br />
              <span className="text-primary">Growing Local Businesses</span>
            </h1>
            
            <p className="animate-fade-in-up animation-delay-200 mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground opacity-0">
              Discover talented women entrepreneurs in your community. Support home-based businesses and help local dreams flourish.
            </p>
            
            <div className="animate-fade-in-up animation-delay-300 flex flex-col gap-4 opacity-0 sm:flex-row">
              <Link href="/register/customer">
                <Button size="lg" className="btn-hover-scale group w-full rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Continue as Customer
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/register/business">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-hover-scale w-full rounded-full border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
                >
                  <Store className="mr-2 h-5 w-5" />
                  Register Your Business
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up animation-delay-400 mt-12 grid grid-cols-3 gap-8 border-t border-border/50 pt-8 opacity-0">
              <div className="text-center lg:text-left">
                <p className="animate-count-up animation-delay-500 text-2xl font-bold text-primary opacity-0 md:text-3xl">500+</p>
                <p className="text-sm text-muted-foreground">Women Entrepreneurs</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="animate-count-up animation-delay-600 text-2xl font-bold text-primary opacity-0 md:text-3xl">50+</p>
                <p className="text-sm text-muted-foreground">Service Categories</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="animate-count-up animation-delay-500 text-2xl font-bold text-primary opacity-0 md:text-3xl">10K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="animate-slide-in-right relative flex items-center justify-center opacity-0">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-peach/40 via-blush/30 to-lavender/40 blur-2xl" />
            <div className="animate-gentle-float relative overflow-hidden rounded-3xl border border-border/50 bg-card p-2 shadow-2xl">
              <Image
                src="/images/hero-illustration.jpg"
                alt="Woman entrepreneur representing empowerment and independence"
                width={500}
                height={500}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="animate-fade-in-up animation-delay-500 absolute -bottom-4 -left-4 rounded-2xl border border-border/50 bg-card px-4 py-3 opacity-0 shadow-lg md:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Join Today</p>
                  <p className="text-xs text-muted-foreground">Free for all women</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
