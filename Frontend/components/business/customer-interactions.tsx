"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Customer {
  id: string
  name: string
  phone: string
  totalVisits: number
  lastVisit: string
  initials: string
}

export function CustomerInteractions() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/bookings/business`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const bookings = await res.json()
          
          // Group bookings by customer
          const customerMap = new Map<string, any>()
          
          bookings.forEach((booking: any) => {
            const customerId = booking.customerId?._id || booking.customerId
            if (!customerMap.has(customerId)) {
              customerMap.set(customerId, {
                id: customerId,
                name: booking.customerName || booking.customerId?.fullName || "Unknown Customer",
                phone: booking.customerPhone || booking.customerId?.phone || "",
                totalVisits: 1,
                lastVisit: new Date(booking.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                initials: (booking.customerName || "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
              })
            } else {
              const customer = customerMap.get(customerId)
              customer.totalVisits += 1
              customer.lastVisit = new Date(booking.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
          })
          
          const customerList = Array.from(customerMap.values()).sort((a, b) => 
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          )
          
          setCustomers(customerList)
        } else {
          setError("Failed to load customers")
        }
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError("Error loading customers")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hi ${name}! This is Priya from Priya's Beauty Parlour. How can I help you today?`)
    window.open(`https://wa.me/${phone.replace(/\s/g, "")}?text=${message}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="mb-2 text-2xl font-bold text-foreground md:text-3xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Customer Interactions
        </h1>
        <p className="text-muted-foreground">View and connect with your customers</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Customers
          </CardTitle>
          <CardDescription>
            {loading ? "Loading customers..." : `${customers.length} customer${customers.length !== 1 ? "s have" : " has"} booked your service`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading customer data...</p>
            </div>
          )}
          
          {!loading && customers.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings yet. Your customers will appear here.</p>
            </div>
          )}
          
          {!loading && customers.length > 0 && (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div 
                  key={customer.id}
                  className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {customer.totalVisits} booking{customer.totalVisits !== 1 ? "s" : ""}
                        </span>
                        <span>Last: {customer.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleCall(customer.phone)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!customer.phone}
                    >
                      <Phone className="h-4 w-4 mr-1.5" />
                      Call
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleWhatsApp(customer.phone, customer.name)}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!customer.phone}
                    >
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
