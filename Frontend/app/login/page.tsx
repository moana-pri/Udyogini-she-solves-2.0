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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Store } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [customerForm, setCustomerForm] = useState({ phone: "", password: "" })
  const [businessForm, setBusinessForm] = useState({ phone: "", password: "" })

 const handleCustomerLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerForm),
    }
  )

  const data = await res.json()

  if (!res.ok || data.user.role !== "customer") {
    alert("Invalid customer login")
    return
  }

  localStorage.setItem("token", data.token)
  localStorage.setItem("userName", data.user.fullName)
  localStorage.setItem("role", data.user.role)

  router.push("/customer/dashboard")
}


  const handleBusinessLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(businessForm),
    }
  )

  const data = await res.json()

  if (!res.ok || data.user.role !== "business_owner") {
    alert("Invalid business login")
    return
  }

  localStorage.setItem("token", data.token)
  localStorage.setItem("userName", data.user.fullName)
  localStorage.setItem("role", data.user.role)
  localStorage.setItem("language", data.user.preferredLanguage)


  router.push("/business/dashboard")
}


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 
              className="mb-2 text-3xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Welcome Back
            </h1>
            <p className="text-muted-foreground">Sign in to your UDYOGINI account</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger value="customer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <User className="mr-2 h-4 w-4" />
                    Customer
                  </TabsTrigger>
                  <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Store className="mr-2 h-4 w-4" />
                    Business
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="customer" className="mt-6">
                  <CardTitle className="text-lg">Customer Login</CardTitle>
                  <CardDescription className="mt-1">
                    Access your customer account to discover local services
                  </CardDescription>
                  <form onSubmit={handleCustomerLogin} className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-phone">Contact Number</Label>
                      <Input
                        id="customer-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        className="rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="customer-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={customerForm.password}
                          onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
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
                    <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign In as Customer
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {"Don't have an account? "}
                      <Link href="/register/customer" className="font-medium text-primary hover:underline">
                        Register here
                      </Link>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="business" className="mt-6">
                  <CardTitle className="text-lg">Business Login</CardTitle>
                  <CardDescription className="mt-1">
                    Access your business dashboard to manage your services
                  </CardDescription>
                  <form onSubmit={handleBusinessLogin} className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Contact Number</Label>
                      <Input
                        id="business-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                        className="rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="business-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={businessForm.password}
                          onChange={(e) => setBusinessForm({ ...businessForm, password: e.target.value })}
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
                    <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign In as Business Owner
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {"Don't have an account? "}
                      <Link href="/register/business" className="font-medium text-primary hover:underline">
                        Register your business
                      </Link>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
