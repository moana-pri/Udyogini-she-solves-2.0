"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Heart, MessageCircle } from "lucide-react"

interface Business {
  id: number
  name: string
  type: string
  location: string
  distance: string
  priceRange: string
  rating: number
  reviews: number
  phone: string
  image: string
}

interface BusinessCardProps {
  business: Business
  isFavorite?: boolean
}

export function BusinessCard({ business, isFavorite: initialFavorite = false }: BusinessCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  const getPriceLabel = (range: string) => {
    switch (range) {
      case "budget":
        return "Budget Friendly"
      case "moderate":
        return "Moderate"
      case "premium":
        return "Premium"
      default:
        return range
    }
  }

  const handleCall = () => {
    window.open(`tel:${business.phone}`, "_self")
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi! I found your business on UDYOGINI and would like to inquire about your services.`)
    window.open(`https://wa.me/${business.phone.replace(/\s/g, "")}?text=${message}`, "_blank")
  }

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={business.image || "/placeholder.svg"}
          alt={business.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
        <Badge 
          variant="secondary" 
          className="absolute left-3 top-3 bg-card/90 backdrop-blur-sm"
        >
          {business.type}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="mb-1 font-semibold text-foreground">{business.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{business.location}</span>
            <span className="mx-1">•</span>
            <span>{business.distance}</span>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{business.rating}</span>
            <span className="text-sm text-muted-foreground">({business.reviews})</span>
          </div>
          <Badge variant="outline" className="border-border text-xs">
            {getPriceLabel(business.priceRange)}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleCall}
            size="sm" 
            className="flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Phone className="mr-1.5 h-3.5 w-3.5" />
            Call
          </Button>
          <Button 
            onClick={handleWhatsApp}
            size="sm" 
            variant="outline"
            className="flex-1 rounded-lg border-green-500 bg-transparent text-green-600 hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
