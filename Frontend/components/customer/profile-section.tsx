"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Phone, MapPin, Mail, Edit2, Save, X, Camera } from "lucide-react"

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Anita Sharma",
    phone: "+91 98765 43210",
    email: "anita.sharma@email.com",
    location: "Koramangala, Bangalore",
  })
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Your Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your account information</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Personal Information</CardTitle>
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
                    {profile.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">Customer since Nov 2024</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Location
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="bg-card"
                  />
                ) : (
                  <p className="py-2 text-foreground">{profile.location}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Total Bookings</span>
              <span className="text-lg font-semibold text-foreground">12</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Reviews Given</span>
              <span className="text-lg font-semibold text-foreground">8</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Favorites</span>
              <span className="text-lg font-semibold text-foreground">5</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
              <span className="text-sm text-primary font-medium">Businesses Supported</span>
              <span className="text-lg font-semibold text-primary">7</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
