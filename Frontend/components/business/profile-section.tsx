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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setForm)
  }, [])

  const saveProfile = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    })

    alert("Profile updated successfully")
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
