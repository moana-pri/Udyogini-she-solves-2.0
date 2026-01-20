"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Navigation } from "lucide-react"

const serviceTypes = [
  { value: "all", label: "All Services" },
  { value: "beauty-parlour", label: "Beauty Parlour" },
  { value: "tailoring", label: "Tailoring & Fashion" },
  { value: "food", label: "Home Food & Catering" },
  { value: "mehendi", label: "Mehendi Art" },
  { value: "handicrafts", label: "Handicrafts & Jewelry" },
  { value: "tutoring", label: "Tutoring & Education" },
  { value: "wellness", label: "Wellness & Yoga" },
  { value: "daycare", label: "Daycare Services" },
]

interface SearchSectionProps {
  onSearch: (serviceType: string, location: string) => void
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [serviceType, setServiceType] = useState("")
  const [location, setLocation] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const handleSearch = () => {
    onSearch(serviceType, location)
  }

  const handleNearbySearch = async () => {
    setIsLoadingLocation(true)
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            
            // Fetch nearby businesses from API
            const params = new URLSearchParams()
            params.append("lat", lat.toString())
            params.append("lng", lng.toString())
            params.append("radius", "25")
            
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/business/nearby?${params}`
            )
            const businesses = await response.json()
            
            // Store results and trigger callback
            setLocation(`Near You (${businesses.length} services found)`)
            onSearch(serviceType, `nearby:${lat},${lng}`)
            setIsLoadingLocation(false)
          },
          () => {
            alert("Please enable location permission to find nearby services")
            setIsLoadingLocation(false)
          }
        )
      } else {
        alert("Geolocation is not supported by your browser")
        setIsLoadingLocation(false)
      }
    } catch (error) {
      console.error("Error fetching nearby businesses:", error)
      setIsLoadingLocation(false)
    }
  }

  return (
    <Card className="border-border/50 bg-gradient-to-r from-muted/50 via-blush/20 to-muted/50">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Find Services</h2>
          <p className="text-sm text-muted-foreground">Search for women-owned businesses near you</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="h-12 rounded-xl bg-card">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select service type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 rounded-xl bg-card pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              className="h-12 flex-1 rounded-xl bg-primary px-6 text-primary-foreground hover:bg-primary/90 md:flex-none"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button 
              onClick={handleNearbySearch}
              disabled={isLoadingLocation}
              variant="outline"
              className="h-12 rounded-xl border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            >
              <Navigation className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{isLoadingLocation ? "Getting location..." : "Nearby"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
