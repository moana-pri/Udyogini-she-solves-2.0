"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { getCurrentLocation, geocodeAddress, reverseGeocode } from "@/lib/geolocation"

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState(initialLocation || { lat: 12.9352, lng: 77.6245, address: "" })
  const [showMap, setShowMap] = useState(false)
  const [searchAddress, setSearchAddress] = useState(initialLocation?.address || "")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-fill current location on component mount
  useEffect(() => {
    if (!initialLocation && !autoFilled) {
      handleAutoFillCurrentLocation()
    }
  }, [])

  // Auto-fill current location with reverse geocoding
  const handleAutoFillCurrentLocation = async () => {
    setIsLoadingLocation(true)
    setError(null)
    try {
      const locationData = await getCurrentLocation()
      setLocation(locationData)
      setSearchAddress(locationData.address)
      onLocationSelect(locationData.lat, locationData.lng, locationData.address)
      setAutoFilled(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unable to get your location"
      console.error("Error getting location:", err)
      setError(errorMsg)
      setAutoFilled(true) // Don't retry
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Use current location button (manual trigger)
  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true)
    setError(null)
    try {
      const locationData = await getCurrentLocation()
      setLocation(locationData)
      setSearchAddress(locationData.address)
      onLocationSelect(locationData.lat, locationData.lng, locationData.address)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unable to get your location. Please enable location access."
      console.error("Error:", err)
      setError(errorMsg)
      alert(errorMsg)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Search address with geocoding
  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return

    setIsLoadingSearch(true)
    setError(null)
    try {
      const result = await geocodeAddress(searchAddress)
      setLocation(result)
      onLocationSelect(result.lat, result.lng, result.address)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Address not found. Please try another search."
      console.error("Error searching address:", err)
      setError(errorMsg)
      alert(errorMsg)
    } finally {
      setIsLoadingSearch(false)
    }
  }

  // Update location when map pin is moved (for interactive maps)
  const handleMapLocationChange = async (lat: number, lng: number) => {
    setIsLoadingLocation(true)
    setError(null)
    try {
      const address = await reverseGeocode(lat, lng)
      setLocation({ lat, lng, address })
      setSearchAddress(address)
      onLocationSelect(lat, lng, address)
    } catch (err) {
      console.error("Error updating location:", err)
      setLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
      onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">⚠️ Notice</p>
              <p className="text-sm text-amber-800 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State for Initial Auto-Fill */}
      {isLoadingLocation && !autoFilled && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-800 font-medium">Getting your current location...</p>
          </div>
        </Card>
      )}

      {/* Location Info */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
          <div className="space-y-2 w-full">
            <p className="text-sm font-medium text-green-900">📍 Selected Location</p>
            {location.address ? (
              <>
                <p className="text-sm text-green-800 font-semibold">Address:</p>
                <p className="text-sm text-green-700 bg-white p-3 rounded border border-green-200 break-words">
                  {location.address}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
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
        <Label htmlFor="address">Search or Change Location</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            placeholder="Enter city, area, or address (e.g., Sukhsagar Nagar, Pune)"
            value={searchAddress}
            onChange={(e) => {
              setSearchAddress(e.target.value)
              setError(null)
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearchAddress()
            }}
            disabled={isLoadingSearch}
          />
          <Button 
            onClick={handleSearchAddress} 
            variant="outline" 
            size="sm"
            disabled={isLoadingSearch || !searchAddress.trim()}
          >
            {isLoadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Tip: Search by city (e.g., "Pune"), area (e.g., "Koramangala"), or full address
        </p>
      </div>

      {/* Current Location Button */}
      <Button
        onClick={handleUseCurrentLocation}
        disabled={isLoadingLocation}
        variant="secondary"
        className="w-full"
      >
        {isLoadingLocation ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 mr-2" />
            Use Current Location
          </>
        )}
      </Button>

      {/* Toggle Map */}
      <Button
        onClick={() => setShowMap(!showMap)}
        variant="outline"
        className="w-full"
      >
        {showMap ? "📍 Hide Map" : "🗺️ View on Map"}
      </Button>

      {/* Map Display - View on OpenStreetMap */}
      {showMap && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm font-medium text-gray-900">Click on the map to select a precise location:</p>
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
            📍 Open Interactive Map
          </Button>
          <p className="text-xs text-muted-foreground">
            • Click on the map to select your business location<br/>
            • The coordinates will appear in the URL<br/>
            • Copy the latitude and longitude to manually update if needed
          </p>
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
        ✓ Your location is automatically detected on first load<br/>
        ✓ Search to change or fine-tune the location<br/>
        ✓ The address field below will auto-populate from your selection
      </p>
    </div>
  )
}
