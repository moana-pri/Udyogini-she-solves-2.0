"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, User } from "lucide-react"

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
]


export default function CustomerRegistrationPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    preferredLanguage: "en",
  })

  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  console.log("Submitting form:", form)

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match")
    return
  }

  alert("Submitting form")


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/customer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }
  )

  const data = await res.json()

if (!res.ok) {
  console.error("Registration error:", data)
  alert(data.message || "Registration failed")
  return
}


  router.push("/login")
}



  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-12">
        <div className="w-full max-w-md">
          <Link 
            href="/" 
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <h1 
              className="mb-2 text-3xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Join as Customer
            </h1>
            <p className="text-muted-foreground">
              Discover amazing services from local women entrepreneurs
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Create Your Account</CardTitle>
              <CardDescription>
                Quick and easy signup to start exploring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name <span className="text-primary">*</span></Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
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
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your city or area"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
  <Label>Preferred Language</Label>
  <div className="flex gap-2">
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


                <div className="space-y-2">
                  <Label htmlFor="password">Password <span className="text-primary">*</span></Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="rounded-lg"
                    required
                  />
                </div>

                <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
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
