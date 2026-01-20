"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit2, Save, X, Camera } from "lucide-react"

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    businessName: "",
    businessType: "",
    ownerName: "",
  })
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    ownerName: "",
    location: { address: "" },
    workingHours: "",
    priceRange: "",
    businessDescription: { text: "" },
    averageRating: 0,
    profileViews: 0,
    status: "pending",
  })
  const [editedProfile, setEditedProfile] = useState(profile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        // Fetch user profile
        let userData = {}
        try {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if (userRes.ok) {
            userData = await userRes.json()
          }
        } catch (err) {
          console.error("Error fetching user profile:", err)
        }

        // Fetch business profile
        let businessData = {}
        try {
          const businessRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/business/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if (businessRes.ok) {
            businessData = await businessRes.json()
          } else {
            console.error("Business profile not found")
          }
        } catch (err) {
          console.error("Error fetching business profile:", err)
        }

        const profileData = {
          fullName: userData.fullName || businessData.ownerName || "Business Owner",
          phone: userData.phone || "",
          businessName: businessData.businessName || "",
          businessType: businessData.businessType || "",
          ownerName: businessData.ownerName || userData.fullName || "",
        }
        
        setProfile(profileData)
        setEditedProfile(profileData)
        setBusinessInfo(businessData)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")

      // Update user profile
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: editedProfile.fullName,
            phone: editedProfile.phone,
          }),
        }
      )

      // Update business profile
      const businessRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName: editedProfile.businessName,
            businessType: editedProfile.businessType,
          }),
        }
      )

      if (userRes.ok && businessRes.ok) {
        const userData = await userRes.json()
        const updatedProfile = {
          fullName: userData.fullName,
          phone: userData.phone,
          businessName: editedProfile.businessName,
          businessType: editedProfile.businessType,
        }
        setProfile(updatedProfile)
        setIsEditing(false)
        alert("Profile updated successfully!")
      } else {
        alert("Failed to update profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      alert("Error updating profile")
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 text-primary">👩‍💼</span>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Business Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your business information</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Business Information</CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5 bg-transparent"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-1.5 bg-transparent"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profile.businessName.substring(0, 2).toUpperCase() || "BZ"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{profile.businessName || "Business Name"}</h3>
                <p className="text-sm text-muted-foreground">Owner: {profile.fullName}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="owner-name" className="flex items-center gap-2">
                  👤 Owner Name
                </Label>
                {isEditing ? (
                  <Input
                    id="owner-name"
                    value={editedProfile.fullName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner-phone" className="flex items-center gap-2">
                  📱 Contact Number
                </Label>
                {isEditing ? (
                  <Input
                    id="owner-phone"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-name" className="flex items-center gap-2">
                  🏪 Business Name
                </Label>
                {isEditing ? (
                  <Input
                    id="business-name"
                    value={editedProfile.businessName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.businessName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-type" className="flex items-center gap-2">
                  💼 Business Type
                </Label>
                {isEditing ? (
                  <Input
                    id="business-type"
                    value={editedProfile.businessType}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessType: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.businessType}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  📍 Location
                </Label>
                <p className="py-2 text-foreground">{businessInfo.location?.address || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="working-hours" className="flex items-center gap-2">
                  🕐 Working Hours
                </Label>
                <p className="py-2 text-foreground">{businessInfo.workingHours || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-range" className="flex items-center gap-2">
                  💰 Price Range
                </Label>
                <p className="py-2 text-foreground capitalize">{businessInfo.priceRange || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Business Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Profile Views</span>
              <span className="text-lg font-semibold text-foreground">{businessInfo.profileViews || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Rating</span>
              <span className="text-lg font-semibold text-foreground">{businessInfo.averageRating?.toFixed(1) || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-lg font-semibold text-foreground capitalize">{businessInfo.status || "Pending"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
              <span className="text-sm text-primary font-medium">Active Since</span>
              <span className="text-lg font-semibold text-primary">2024</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
