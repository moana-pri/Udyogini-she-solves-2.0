"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Phone, MessageCircle, Calendar, Clock, Zap, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

interface Booking {
  _id: string
  customerId: string
  businessId: string
  businessName: string
  businessPhone: string
  service: string
  date: string
  time: string
  price?: number
  notes?: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "declined"
  declinedReason?: string
  createdAt: string
}

interface BookingCardProps {
  booking: Booking
  onCall: (phone: string) => void
  onWhatsApp: (phone: string) => void
  onCancel: (id: string) => Promise<void>
  language: "EN" | "HI"
  isLoading: boolean
}

const translations = {
  EN: {
    title: "My Bookings",
    subtitle: "View and manage your service bookings",
    noBookings: "No bookings yet",
    noBookingsDesc: "You haven't made any bookings. Start by browsing services.",
    browseServices: "Browse Services",
    status: {
      pending: "Pending Approval",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      declined: "Declined",
    },
    callOwner: "Call Owner",
    messageOwner: "Message Owner",
    cancelBooking: "Cancel Booking",
    cancelConfirm: "Are you sure you want to cancel this booking?",
    service: "Service",
    date: "Date",
    time: "Time",
    price: "Price",
    notes: "Notes",
    loading: "Loading bookings...",
    error: "Error loading bookings",
    retrying: "Retrying...",
    viewDetails: "Show Details",
    hideDetails: "Hide Details",
    declinedReason: "Reason",
    owner: "Owner",
  },
  HI: {
    title: "मेरी बुकिंग",
    subtitle: "अपनी सेवा बुकिंग को देखें और प्रबंधित करें",
    noBookings: "कोई बुकिंग नहीं",
    noBookingsDesc: "आपने अभी तक कोई बुकिंग नहीं की है। सेवाओं को ब्राउज़ करना शुरू करें।",
    browseServices: "सेवाओं को ब्राउज़ करें",
    status: {
      pending: "अनुमोदन के लिए प्रतीक्षा",
      confirmed: "पुष्टि की गई",
      completed: "पूर्ण",
      cancelled: "रद्द",
      declined: "अस्वीकार",
    },
    callOwner: "मालिक को कॉल करें",
    messageOwner: "मालिक को संदेश भेजें",
    cancelBooking: "बुकिंग रद्द करें",
    cancelConfirm: "क्या आप इस बुकिंग को रद्द करना चाहते हैं?",
    service: "सेवा",
    date: "तारीख",
    time: "समय",
    price: "कीमत",
    notes: "नोट्स",
    loading: "बुकिंग लोड हो रही हैं...",
    error: "बुकिंग लोड करने में त्रुटि",
    retrying: "पुनः प्रयास किया जा रहा है...",
    viewDetails: "विवरण दिखाएं",
    hideDetails: "विवरण छिपाएं",
    declinedReason: "कारण",
    owner: "मालिक",
  },
}

function BookingCard({ booking, onCall, onWhatsApp, onCancel, language, isLoading }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const t = translations[language]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCancel = async () => {
    if (!confirm(t.cancelConfirm)) return
    setCancelling(true)
    try {
      await onCancel(booking._id)
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === "EN" ? "en-US" : "hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div
          className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{booking.businessName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {t.status[booking.status as keyof typeof t.status]}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>{booking.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{booking.time}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="border-t p-4 space-y-4">
            {/* Owner Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-2">{t.owner}</p>
              <p className="font-semibold text-gray-800">{booking.businessName}</p>
              {booking.businessPhone && (
                <p className="text-sm text-gray-600 mt-1">📱 {booking.businessPhone}</p>
              )}
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {booking.price && (
                <div>
                  <p className="text-gray-600 text-xs uppercase font-semibold">{t.price}</p>
                  <p className="font-semibold text-gray-800">₹{booking.price}</p>
                </div>
              )}
              {booking.notes && (
                <div className="col-span-2">
                  <p className="text-gray-600 text-xs uppercase font-semibold">{t.notes}</p>
                  <p className="text-gray-700 mt-1">{booking.notes}</p>
                </div>
              )}
            </div>

            {/* Declined Reason */}
            {booking.status === "declined" && booking.declinedReason && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-xs text-red-600 uppercase font-semibold mb-1">{t.declinedReason}</p>
                <p className="text-sm text-red-700">{booking.declinedReason}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {booking.status === "confirmed" && booking.businessPhone && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onCall(booking.businessPhone)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t.callOwner}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onWhatsApp(booking.businessPhone)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t.messageOwner}
                  </Button>
                </>
              )}
              {booking.status === "pending" && (
                <Button
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling || isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {cancelling ? "Cancelling..." : t.cancelBooking}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function CustomerBookingsPage() {
  const { language } = useLanguage()
  const t = translations[(language || "EN") as "EN" | "HI"] || translations["EN"]
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/customer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      } else {
        setError(t?.error || "Error loading bookings")
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError(t?.error || "Error loading bookings")
    }
    setLoading(false)
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    const whatsappLink = `https://wa.me/${cleanPhone}`
    window.open(whatsappLink, "_blank")
  }

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.ok) {
        setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b)))
      } else {
        alert("Failed to cancel booking")
      }
    } catch (err) {
      console.error("Error cancelling booking:", err)
      alert("Error cancelling booking")
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600">{t?.loading || "Loading bookings..."}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchBookings}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                {t.retrying}
              </Button>
            </div>
          )}

          {/* No Bookings */}
          {bookings.length === 0 && !error && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.noBookings}</h3>
                <p className="text-gray-600 mb-6">{t.noBookingsDesc}</p>
                <Link href="/customer/dashboard">
                  <Button className="bg-pink-600 hover:bg-pink-700">{t.browseServices}</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Bookings List */}
          {bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCall={handleCall}
                  onWhatsApp={handleWhatsApp}
                  onCancel={handleCancel}
                  language={language as "EN" | "HI"}
                  isLoading={loading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
