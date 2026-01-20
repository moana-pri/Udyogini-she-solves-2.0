"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const customers = [
  {
    id: 1,
    name: "Anita Sharma",
    phone: "+91 98765 43210",
    totalVisits: 12,
    lastVisit: "Jan 19, 2026",
    initials: "AS",
  },
  {
    id: 2,
    name: "Priya Patel",
    phone: "+91 87654 32109",
    totalVisits: 8,
    lastVisit: "Jan 15, 2026",
    initials: "PP",
  },
  {
    id: 3,
    name: "Kavitha Reddy",
    phone: "+91 76543 21098",
    totalVisits: 15,
    lastVisit: "Jan 12, 2026",
    initials: "KR",
  },
  {
    id: 4,
    name: "Meera Singh",
    phone: "+91 65432 10987",
    totalVisits: 5,
    lastVisit: "Jan 10, 2026",
    initials: "MS",
  },
  {
    id: 5,
    name: "Lakshmi Nair",
    phone: "+91 54321 09876",
    totalVisits: 20,
    lastVisit: "Jan 8, 2026",
    initials: "LN",
  },
]

export function CustomerInteractions() {
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
            {customers.length} customers have visited your business
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        {customer.totalVisits} visits
                      </span>
                      <span>Last: {customer.lastVisit}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCall(customer.phone)}
                    className="rounded-lg border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Phone className="mr-1.5 h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleWhatsApp(customer.phone, customer.name)}
                    className="rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
