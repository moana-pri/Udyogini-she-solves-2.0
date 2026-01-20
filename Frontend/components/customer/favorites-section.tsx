"use client"

import { BusinessCard } from "./business-card"
import { Heart } from "lucide-react"

const favoriteBusinesses = [
  {
    id: 1,
    name: "Priya's Beauty Studio",
    type: "Beauty Parlour",
    location: "Koramangala",
    distance: "1.2 km",
    priceRange: "moderate",
    rating: 4.8,
    reviews: 124,
    phone: "+919876543210",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 2,
    name: "Lakshmi's Kitchen",
    type: "Home Food",
    location: "Indiranagar",
    distance: "2.5 km",
    priceRange: "budget",
    rating: 4.9,
    reviews: 89,
    phone: "+919876543211",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 3,
    name: "Asha's Mehendi Art",
    type: "Mehendi Art",
    location: "HSR Layout",
    distance: "3.1 km",
    priceRange: "premium",
    rating: 4.7,
    reviews: 156,
    phone: "+919876543213",
    image: "/images/hero-illustration.jpg",
  },
]

export function FavoritesSection() {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Your Favorites</h2>
          <p className="text-sm text-muted-foreground">Businesses you have saved for quick access</p>
        </div>
      </div>

      {favoriteBusinesses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteBusinesses.map((business, index) => (
            <div 
              key={business.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BusinessCard business={business} isFavorite={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">No favorites yet</h3>
          <p className="text-sm text-muted-foreground">
            Start exploring and save your favorite businesses here
          </p>
        </div>
      )}
    </div>
  )
}
