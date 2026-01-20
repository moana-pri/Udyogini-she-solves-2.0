"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { CustomerDashboardHeader } from "@/components/customer/dashboard-header"
import { SearchSection } from "@/components/customer/search-section"
import { BusinessCard } from "@/components/customer/business-card"
import { BookingHistory } from "@/components/customer/booking-history"
import { FavoritesSection } from "@/components/customer/favorites-section"
import { ReviewsSection } from "@/components/customer/reviews-section"
import { ProfileSection } from "@/components/customer/profile-section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Star, Heart, Calendar, ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"
import { useEffect } from "react"


// Sample business data
const sampleBusinesses = [
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
    name: "Meera's Boutique",
    type: "Tailoring",
    location: "Jayanagar",
    distance: "1.8 km",
    priceRange: "moderate",
    rating: 4.6,
    reviews: 67,
    phone: "+919876543212",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 4,
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
  {
    id: 5,
    name: "Sunita's Craft Studio",
    type: "Handicrafts",
    location: "Whitefield",
    distance: "5.2 km",
    priceRange: "moderate",
    rating: 4.5,
    reviews: 43,
    phone: "+919876543214",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 6,
    name: "Kavita's Yoga Center",
    type: "Wellness",
    location: "Marathahalli",
    distance: "4.0 km",
    priceRange: "budget",
    rating: 4.9,
    reviews: 112,
    phone: "+919876543215",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 7,
    name: "Divya's Tailoring Studio",
    type: "Tailoring",
    location: "Vijaynagar",
    distance: "2.3 km",
    priceRange: "budget",
    rating: 4.7,
    reviews: 78,
    phone: "+919876543216",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 8,
    name: "Anjali's Beauty Parlor",
    type: "Beauty Parlour",
    location: "bibewadi",
    distance: "3.5 km",
    priceRange: "premium",
    rating: 4.9,
    reviews: 203,
    phone: "+919876543217",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 9,
    name: "Neha's Cooking Classes",
    type: "Home Food",
    location: "suksagar,katraj",
    distance: "4.2 km",
    priceRange: "moderate",
    rating: 4.6,
    reviews: 95,
    phone: "+919876543218",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 10,
    name: "Rekha's Jewelry Design",
    type: "Handicrafts",
    location: "lake town,pune ",
    distance: "2.8 km",
    priceRange: "premium",
    rating: 4.8,
    reviews: 134,
    phone: "+919876543219",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 11,
    name: "Pooja's Dance Academy",
    type: "Wellness",
    location: "indiranager,pune ",
    distance: "1.9 km",
    priceRange: "budget",
    rating: 4.7,
    reviews: 67,
    phone: "+919876543220",
    image: "/images/hero-illustration.jpg",
  },
  {
    id: 12,
    name: "Sneha's Online Tutoring",
    type: "Tutoring & Education",
    location: "banglore ",
    distance: "5.5 km",
    priceRange: "moderate",
    rating: 4.9,
    reviews: 189,
    phone: "+919876543221",
    image: "/images/hero-illustration.jpg",
  },
]

export default function CustomerDashboard() {
  const { language } = useLanguage()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token || role !== "customer") {
      window.location.href = "/login"
    }
  }, [])  

  useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFilteredBusinesses(data);
        });
    },
    () => {
      // fallback if user denies location
      setFilteredBusinesses(sampleBusinesses);
    }
  );
}, []);



  const [activeTab, setActiveTab] = useState("home")
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([])
  const [pendingReviewId, setPendingReviewId] = useState<string | null>(null)
  const [userName, setUserName] = useState("User")
  const searchParams = useSearchParams()

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userName")
    if (savedName) {
      setUserName(savedName)
    }
  }, [])


  const handleSearch = async (serviceType: string, location: string) => {
    let results: any[] = []
    
    // Handle nearby location search
    if (location.startsWith("nearby:")) {
      const [lat, lng] = location.split(":")[1].split(",")
      const params = new URLSearchParams()
      params.append("lat", lat)
      params.append("lng", lng)
      params.append("radius", "25")
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business/nearby?${params}`
        )
        results = await response.json()
        
        // Filter by service type if selected
        if (serviceType && serviceType !== "all") {
          const typeMap: Record<string, string> = {
            "beauty-parlour": "Beauty Parlour",
            "tailoring": "Tailoring & Fashion",
            "food": "Home Food & Catering",
            "mehendi": "Mehendi Art",
            "handicrafts": "Handicrafts & Jewelry",
            "wellness": "Wellness & Yoga",
          }
          results = results.filter((b: any) => b.businessType === typeMap[serviceType])
        }
      } catch (error) {
        console.error("Error fetching nearby businesses:", error)
        results = []
      }
    } else {
      // Regular search with sample data
      results = sampleBusinesses
      
      if (serviceType && serviceType !== "all") {
        const typeMap: Record<string, string> = {
          "beauty-parlour": "Beauty Parlour",
          "tailoring": "Tailoring",
          "food": "Home Food",
          "mehendi": "Mehendi Art",
          "handicrafts": "Handicrafts",
          "wellness": "Wellness",
        }
        results = results.filter((b) => b.type === typeMap[serviceType])
      }
      
      if (location) {
        results = results.filter((b) => 
          b.location.toLowerCase().includes(location.toLowerCase())
        )
      }
    }
    
    setFilteredBusinesses(results)
    setActiveTab("search")
  }

  const handleReviewClick = (bookingId: string) => {
    setPendingReviewId(bookingId)
    setActiveTab("reviews")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="animate-fade-in-up">
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                {t("welcome", language)} back, <span className="text-primary">{userName}</span>
              </h1>
              <p className="mt-1 text-muted-foreground">
                Discover and support women-owned businesses in your community
              </p>
            </div>

            {/* Search Section */}
            <div className="animate-fade-in-up animation-delay-100">
              <SearchSection onSearch={handleSearch} />
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-200">
              <Card className="border-border/50 card-hover-lift cursor-pointer" onClick={() => setActiveTab("bookings")}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">{t("my_bookings", language)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 card-hover-lift cursor-pointer" onClick={() => setActiveTab("favorites")}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">5</p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 card-hover-lift cursor-pointer" onClick={() => setActiveTab("reviews")}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">8</p>
                    <p className="text-sm text-muted-foreground">Reviews Given</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 card-hover-lift">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">7</p>
                    <p className="text-sm text-muted-foreground">Women Supported</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Section */}
            <div className="space-y-4 animate-fade-in-up animation-delay-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary hover:text-primary/90"
                  onClick={() => setActiveTab("search")}
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sampleBusinesses.slice(0, 3).map((business, index) => (
                  <div 
                    key={business.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <BusinessCard business={business} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4 animate-fade-in-up animation-delay-500">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary hover:text-primary/90"
                  onClick={() => setActiveTab("bookings")}
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Priya's Beauty Studio", service: "Bridal Makeup", date: "Dec 28", status: "completed" },
                  { name: "Lakshmi's Kitchen", service: "Party Catering", date: "Jan 5", status: "upcoming" },
                ].map((booking, index) => (
                  <Card 
                    key={booking.name} 
                    className="border-border/50 card-hover-lift cursor-pointer"
                    onClick={() => setActiveTab("bookings")}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-foreground">{booking.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground mt-1">{booking.date}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        booking.status === "completed" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {booking.status === "completed" ? "Completed" : "Upcoming"}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )
      
      case "search":
        return (
          <div className="space-y-6">
            <SearchSection onSearch={handleSearch} />
            
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {filteredBusinesses.length} Services Found
              </h2>
              
              {filteredBusinesses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBusinesses.map((business, index) => (
                    <div 
                      key={business.id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <BusinessCard business={business} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">No services found matching your criteria</p>
                    <Button
                      variant="link"
                      className="mt-2 text-primary"
                      onClick={() => setFilteredBusinesses(sampleBusinesses)}
                    >
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )
      
      case "bookings":
        return <BookingHistory onReviewClick={handleReviewClick} />
      
      case "favorites":
        return <FavoritesSection />
      
      case "reviews":
        return (
          <ReviewsSection 
            pendingReviewId={pendingReviewId} 
            onClearPending={() => setPendingReviewId(null)} 
          />
        )
      
      case "profile":
        return <ProfileSection />
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerDashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {renderContent()}
      </main>
    </div>
  )
}
