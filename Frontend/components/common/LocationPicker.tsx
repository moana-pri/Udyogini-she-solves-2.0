"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState(initialLocation || { lat: 12.9352, lng: 77.6245, address: "" })
  const [showMap, setShowMap] = useState(false)
  const [searchAddress, setSearchAddress] = useState(initialLocation?.address || "")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  // Use current location
  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` })
          onLocationSelect(latitude, longitude, `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          setIsLoadingLocation(false)
        },
        () => {
          alert("Unable to get your location. Please enable location access.")
          setIsLoadingLocation(false)
        }
      )
    }
  }

  // Search address
  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`
      )
      const data = await response.json()

      if (data.length > 0) {
        const first = data[0]
        const lat = parseFloat(first.lat)
        const lng = parseFloat(first.lon)
        setLocation({ lat, lng, address: first.display_name })
        onLocationSelect(lat, lng, first.display_name)
      } else {
        alert("Address not found. Please try another search.")
      }
    } catch (error) {
      console.error("Error searching address:", error)
      alert("Error searching address")
    }
  }

  return (
    <div className="space-y-4">
      {/* Location Info */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
          <div className="space-y-2 w-full">
            <p className="text-sm font-medium text-green-900">📍 Selected Location</p>
            {location.address ? (
              <>
                <p className="text-sm text-green-800 font-semibold">Address:</p>
                <p className="text-sm text-green-700 bg-white p-2 rounded border border-green-200">
                  {location.address}
                </p>
              </>
            ) : (
              <p className="text-sm text-green-800">
                Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Search Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Search Location</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            placeholder="Enter city, area, or address (e.g., Koramangala, Bangalore)"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearchAddress()
            }}
          />
          <Button onClick={handleSearchAddress} variant="outline" size="sm">
            Search
          </Button>
        </div>
      </div>

      {/* Current Location Button */}
      <Button
        onClick={handleUseCurrentLocation}
        disabled={isLoadingLocation}
        variant="secondary"
        className="w-full"
      >
        <MapPin className="h-4 w-4 mr-2" />
        {isLoadingLocation ? "Getting location..." : "Use Current Location"}
      </Button>

      {/* Toggle Map */}
      <Button
        onClick={() => setShowMap(!showMap)}
        variant="outline"
        className="w-full"
      >
        {showMap ? "Hide Map" : "Show Map"}
      </Button>

      {/* Map Display - View on OpenStreetMap */}
      {showMap && (
        <div className="space-y-2">
          <Button
            onClick={() => {
              window.open(
                `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=15`,
                "_blank"
              )
            }}
            variant="outline"
            className="w-full"
          >
            📍 View on OpenStreetMap (Interactive Map)
          </Button>
          <p className="text-xs text-muted-foreground">
            Click the location on the map, then copy the URL to select a precise location
          </p>
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-muted-foreground">
        💡 Tip: You can search by city name (e.g., "Bangalore", "Mumbai"), area name (e.g., "Koramangala"), or
        full address. Click on the map button to select a precise location.
      </p>
    </div>
  )
}
