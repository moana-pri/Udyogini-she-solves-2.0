"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LocationPicker } from "@/components/common/LocationPicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, ArrowLeft, Store } from "lucide-react"

const businessTypes = [
  "Beauty Parlour",
  "Tailoring & Fashion",
  "Home Food & Catering",
  "Mehendi Art",
  "Handicrafts & Jewelry",
  "Tutoring & Education",
  "Wellness & Yoga",
  "Daycare Services",
  "Other",
]

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
]


export default function BusinessRegistrationPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    businessType: "",
    phone: "",
    location: "",
    workingHours: "",
    priceRange: "",
    description: "",
    password: "",
    confirmPassword: "",
    preferredLanguage: "en",
    latitude: null as number | null,
    longitude: null as number | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match")
    return
  }

  if (!form.latitude || !form.longitude) {
    alert("Please select a location on the map")
    return
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/business`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      const errorMsg = data.message || data.error || "Unknown error"
      console.error("Registration error:", { status: res.status, data })
      alert(`Registration failed: ${errorMsg}`)
      return
    }

    console.log("Registration success:", data)
    alert("Registration successful! Redirecting to login...")
    router.push("/login")
  } catch (error) {
    console.error("Registration error:", error)
    alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-12">
        <div className="w-full max-w-lg">
          <Link 
            href="/" 
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <h1 
              className="mb-2 text-3xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Register Your Business
            </h1>
            <p className="text-muted-foreground">
              Join UDYOGINI and connect with customers in your community
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Business Details</CardTitle>
              <CardDescription>
                Tell us about yourself and your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-primary">*</span></Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number <span className="text-primary">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name <span className="text-primary">*</span></Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your business name"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type <span className="text-primary">*</span></Label>
                  <Select
                    value={form.businessType}
                    onValueChange={(value) => setForm({ ...form, businessType: value })}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select your service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <LocationPicker
                  onLocationSelect={(lat, lng, address) =>
                    setForm({
                      ...form,
                      latitude: lat,
                      longitude: lng,
                      location: address,
                    })
                  }
                />

                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-primary">*</span></Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Your business location / area"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours <span className="text-primary">*</span></Label>
                    <Input
                      id="workingHours"
                      type="text"
                      placeholder="e.g., 9 AM - 6 PM"
                      value={form.workingHours}
                      onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                      className="rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range <span className="text-primary">*</span></Label>
                    <Select
                      value={form.priceRange}
                      onValueChange={(value) => setForm({ ...form, priceRange: value })}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget Friendly</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe your services..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="min-h-[80px] rounded-lg"
                  />
                </div>

                <div className="space-y-2">
  <Label>Preferred Language</Label>
  <div className="flex gap-2 flex-wrap">
    {languages.map((lang) => (
      <Button
        key={lang.code}
        type="button"
        variant={form.preferredLanguage === lang.code ? "default" : "outline"}
        onClick={() =>
          setForm({ ...form, preferredLanguage: lang.code })
        }
      >
        {lang.label}
      </Button>
    ))}
  </div>
</div>


                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password <span className="text-primary">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="rounded-lg pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-primary">*</span></Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="rounded-lg"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Register Business
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
