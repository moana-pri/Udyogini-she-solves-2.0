"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ProfileSection() {
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    location: "",
    workingHours: "",
    priceRange: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No authentication token found")
          setLoading(false)
          return
        }

        console.log("🔄 Fetching business profile...")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("📡 Response status:", res.status)

        if (!res.ok) {
          const errorData = await res.json()
          console.error("❌ API Error:", errorData)
          setError(`Could not fetch profile: ${errorData.message || res.statusText}`)
          setLoading(false)
          return
        }

        const data = await res.json()
        console.log("📊 Profile data received:", data)
        
        if (data && typeof data === 'object') {
          setForm({
            businessName: data.businessName || "",
            businessType: data.businessType || "",
            location: data.location?.address || "",
            workingHours: data.workingHours || "",
            priceRange: data.priceRange || "",
            description: data.description || "",
          })
          console.log("✅ Profile form updated successfully")
        } else {
          console.log("⚠️ Received invalid data structure")
        }
        setLoading(false)
      } catch (err) {
        console.error("❌ Error fetching profile:", err)
        setError(`Error loading profile: ${err instanceof Error ? err.message : "Unknown error"}`)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const saveProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        alert("Error updating profile")
        return
      }

      alert("Profile updated successfully")
    } catch (err) {
      console.error("Error saving profile:", err)
      alert("Error saving profile")
    }
  }

  if (loading) {
    return <div className="p-4">Loading profile...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-4 max-w-xl">
      <Input
        placeholder="Business Name"
        value={form.businessName}
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
      />

      <Input
        placeholder="Business Type"
        value={form.businessType}
        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
      />

      <Input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <Input
        placeholder="Working Hours"
        value={form.workingHours}
        onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
      />

      <Input
        placeholder="Price Range"
        value={form.priceRange}
        onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
      />

      <Textarea
        placeholder="Business Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Button onClick={saveProfile}>Save Changes</Button>
    </div>
  )
}
