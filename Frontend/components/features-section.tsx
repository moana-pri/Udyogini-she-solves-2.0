"use client"

import { Scissors, UtensilsCrossed, Palette, Sparkles, Heart, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    icon: Scissors,
    title: "Tailoring & Fashion",
    description: "Custom clothing, alterations, and fashion design services",
    color: "bg-peach/50",
  },
  {
    icon: UtensilsCrossed,
    title: "Home Food & Catering",
    description: "Homemade delicacies, tiffin services, and event catering",
    color: "bg-lavender/50",
  },
  {
    icon: Palette,
    title: "Mehendi & Beauty",
    description: "Bridal mehendi, beauty treatments, and parlour services",
    color: "bg-blush/50",
  },
  {
    icon: Sparkles,
    title: "Handicrafts & Art",
    description: "Handmade jewelry, paintings, and traditional crafts",
    color: "bg-peach/50",
  },
  {
    icon: Heart,
    title: "Wellness & Yoga",
    description: "Yoga classes, wellness coaching, and health services",
    color: "bg-lavender/50",
  },
  {
    icon: MapPin,
    title: "Local Services",
    description: "Tutoring, daycare, and community-based services",
    color: "bg-blush/50",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Our Services
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Discover Local Women-Owned Businesses
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From traditional crafts to modern services, find skilled women entrepreneurs ready to serve you with passion and dedication.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="card-hover-lift group cursor-pointer border-border/50 bg-card"
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-6">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10`}>
                  <service.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-muted via-blush/20 to-muted p-8 text-center md:p-12">
          <h3 className="mb-4 font-serif text-2xl font-bold text-foreground md:text-3xl">
            Ready to Support Local Women Entrepreneurs?
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Join our community of customers and business owners. Together, we can build a stronger, more empowered local economy.
          </p>
        </div>
      </div>
    </section>
  )
}
