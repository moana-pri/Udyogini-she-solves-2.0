"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, CheckCircle, AlertCircle } from "lucide-react"

export default function LocationTestPage() {
  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([])

  const testGeolocation = () => {
    setLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({ latitude, longitude, accuracy })

        // Test API call to nearby businesses
        fetchNearbyBusinesses(latitude, longitude)
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Permission denied. Please enable location access in browser settings.")
            break
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.")
            break
          case error.TIMEOUT:
            setError("Location request timed out.")
            break
          default:
            setError("An unknown error occurred.")
        }
        setLoading(false)
      }
    )
  }

  const fetchNearbyBusinesses = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business/nearby?lat=${lat}&lng=${lng}&radius=10`
      )

      if (!response.ok) {
        setError(`API Error: ${response.status} ${response.statusText}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      setNearbyBusinesses(data)
      setLoading(false)
    } catch (err) {
      setError(`API Error: ${err}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Location Test Page</h1>
          <p className="text-muted-foreground">Test if geolocation and nearby business search is working</p>
        </div>

        {/* Main Test Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Test Geolocation</h2>

          <Button onClick={testGeolocation} disabled={loading} className="w-full" size="lg">
            <MapPin className="h-5 w-5 mr-2" />
            {loading ? "Getting Location..." : "Test My Location"}
          </Button>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {location && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800 space-y-1">
                <p className="font-semibold">✅ Location Found!</p>
                <p>Latitude: <code className="bg-white px-2 py-1 rounded">{location.latitude.toFixed(4)}</code></p>
                <p>Longitude: <code className="bg-white px-2 py-1 rounded">{location.longitude.toFixed(4)}</code></p>
                <p>Accuracy: <code className="bg-white px-2 py-1 rounded">{location.accuracy.toFixed(0)}m</code></p>
              </div>
            </div>
          )}
        </Card>

        {/* Nearby Businesses Results */}
        {nearbyBusinesses.length > 0 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Nearby Businesses Found: {nearbyBusinesses.length}
            </h2>

            <div className="grid gap-4">
              {nearbyBusinesses.map((business: any) => (
                <Card key={business._id} className="p-4 border-l-4 border-l-primary">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">{business.businessName}</p>
                    <p className="text-sm text-muted-foreground">{business.businessType}</p>
                    <p className="text-sm text-blue-600">
                      📍 {business.location?.distance?.toFixed(2)}km away
                    </p>
                    <p className="text-sm">
                      ⭐ {business.averageRating} ({business.totalReviews} reviews)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lat: {business.location?.lat?.toFixed(4)}, Lng: {business.location?.lng?.toFixed(4)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {location && nearbyBusinesses.length === 0 && !loading && !error && (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto" />
              <p className="font-semibold text-foreground">No Nearby Businesses Found</p>
              <p className="text-sm text-muted-foreground">
                No businesses within 10km radius. This could mean:
              </p>
              <ul className="text-sm text-left space-y-1 mt-3 ml-4">
                <li>• No businesses registered in your area yet</li>
                <li>• Backend API not connected properly</li>
                <li>• Database doesn't have location coordinates</li>
              </ul>
            </div>
          </Card>
        )}

        {/* Troubleshooting Guide */}
        <Card className="p-6 space-y-4 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900">🔧 Troubleshooting</h2>

          <div className="space-y-3 text-sm text-blue-900">
            <div>
              <p className="font-semibold mb-1">1. If permission is denied:</p>
              <p className="ml-4">• Click the lock icon in the address bar</p>
              <p className="ml-4">• Find "Location" and change to "Allow"</p>
              <p className="ml-4">• Refresh the page and try again</p>
            </div>

            <div>
              <p className="font-semibold mb-1">2. If no businesses found:</p>
              <p className="ml-4">• Register a business owner account first</p>
              <p className="ml-4">• Go to /register and choose "Register as Business"</p>
              <p className="ml-4">• Use location picker to set coordinates</p>
              <p className="ml-4">• Then test again</p>
            </div>

            <div>
              <p className="font-semibold mb-1">3. Verify backend is running:</p>
              <p className="ml-4">• Backend should be at {process.env.NEXT_PUBLIC_API_URL}</p>
              <p className="ml-4">• Check browser Network tab in DevTools</p>
              <p className="ml-4">• Look for `/api/business/nearby` request</p>
            </div>

            <div>
              <p className="font-semibold mb-1">4. Check browser console:</p>
              <p className="ml-4">• Open DevTools (F12) and check Console tab</p>
              <p className="ml-4">• Look for any error messages</p>
              <p className="ml-4">• Check Network tab for API errors</p>
            </div>
          </div>
        </Card>

        {/* Test Locations */}
        <Card className="p-6 space-y-4 bg-green-50 border-green-200">
          <h2 className="text-lg font-semibold text-green-900">📍 Test with Sample Coordinates</h2>

          <div className="grid gap-2 text-sm">
            <p className="text-green-900">Use these coordinates for testing:</p>
            <code className="bg-white px-3 py-2 rounded">Bangalore: 12.9352, 77.6245</code>
            <code className="bg-white px-3 py-2 rounded">Koramangala: 12.9352, 77.6445</code>
            <code className="bg-white px-3 py-2 rounded">Indiranagar: 13.0025, 77.6400</code>
            <code className="bg-white px-3 py-2 rounded">Whitefield: 12.9698, 77.7499</code>
          </div>
        </Card>
      </div>
    </div>
  )
}
