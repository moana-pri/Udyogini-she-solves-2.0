"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Clock, MapPin, Phone } from "lucide-react"
import Link from "next/link"

interface Business {
  _id: string
  businessName: string
  businessType: string
  phone: string
  location: {
    address: string
    coordinates?: [number, number] // [lng, lat]
  }
  workingHours: string
}

export default function BookingPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceType: "",
    date: "",
    time: "",
    notes: "",
  })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchBusiness = async () => {
      const businessId = new URLSearchParams(window.location.search).get("businessId")
      if (!businessId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/${businessId}`)
        const data = await res.json()
        setBusiness(data)
      } catch (err) {
        console.error("Error fetching business:", err)
      }
      setLoading(false)
    }

    fetchBusiness()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business) return

    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          businessId: business._id,
          service: formData.serviceType,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log("✅ Booking created:", data)
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/customer/dashboard"
        }, 2000)
      } else {
        const errorData = await res.json()
        console.error("Booking error:", errorData)
        alert(`Booking failed: ${errorData.message || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Booking error:", err)
      alert(`Error creating booking: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!business) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Business not found</p>
        </div>
        <Footer />
      </>
    )
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
          <Card className="w-96 border-green-200">
            <CardHeader>
              <div className="text-center">
                <p className="text-4xl mb-2">✅</p>
                <CardTitle>Booking Confirmed!</CardTitle>
                <CardDescription>Your booking has been created successfully</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/customer/dashboard" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Book a Service</CardTitle>
              <CardDescription>Reserve your appointment now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Info */}
              <div className="bg-pink-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{business?.businessName || "Business"}</h3>
                <div className="space-y-2 text-sm">
                  {business?.location?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-pink-600" />
                      <span>{business.location.address}</span>
                    </div>
                  )}
                  {business?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-pink-600" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  {business?.workingHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-pink-600" />
                      <span>{business.workingHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic Service</SelectItem>
                      <SelectItem value="Standard">Standard Service</SelectItem>
                      <SelectItem value="Premium">Premium Service</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or details?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !formData.serviceType || !formData.date || !formData.time}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  {submitting ? "Creating Booking..." : "Confirm Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}
