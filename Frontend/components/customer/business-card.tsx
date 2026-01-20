"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Heart, MessageCircle, Calendar } from "lucide-react"

interface Business {
  id: number
  name: string
  type: string
  location: string | { address: string; coordinates?: [number, number] }
  distance: string
  priceRange: string
  rating: number
  reviews: number
  phone: string
  image: string
  _id?: string
  businessName?: string
  businessType?: string
}

interface BusinessCardProps {
  business: Business
  isFavorite?: boolean
}

export function BusinessCard({ business, isFavorite: initialFavorite = false }: BusinessCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  // Normalize business data from API or sample
  const name = business.businessName || business.name || "Business"
  const type = business.businessType || business.type || "Service"
  const phone = business.phone || ""
  const location = business.location
  const address = typeof location === 'string' ? location : location?.address || 'Location not available'
  const distance = business.distance || ""
  const priceRange = business.priceRange || "moderate"
  const rating = business.rating || 4.5
  const reviews = business.reviews || 0
  const image = business.image || "/placeholder.svg"

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
    if (phone) window.open(`tel:${phone}`, "_self")
  }

  const handleWhatsApp = () => {
    if (phone) {
      const message = encodeURIComponent(`Hi! I found your business on UDYOGINI and would like to inquire about your services.`)
      window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
    }
  }

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
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
          {String(type)}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="mb-1 font-semibold text-foreground">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{address}</span>
            {distance && (
              <>
                <span className="mx-1">•</span>
                <span>{distance}</span>
              </>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
          <Badge variant="outline" className="border-border text-xs">
            {getPriceLabel(priceRange)}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/customer/booking?businessId=${business._id || business.id}`}
            className="flex-1"
            onClick={() => {
              console.log("📍 Booking link with ID:", business._id || business.id)
            }}
          >
            <Button
              size="sm"
              className="w-full rounded-lg bg-pink-600 text-white hover:bg-pink-700"
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Book Now
            </Button>
          </Link>
          <Button 
            onClick={handleCall}
            size="sm" 
            className="flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!phone}
          >
            <Phone className="mr-1.5 h-3.5 w-3.5" />
            Call
          </Button>
          <Button 
            onClick={handleWhatsApp}
            size="sm" 
            variant="outline"
            className="flex-1 rounded-lg border-green-500 bg-transparent text-green-600 hover:bg-green-500 hover:text-white"
            disabled={!phone}
          >
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
