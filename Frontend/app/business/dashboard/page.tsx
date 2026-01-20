"use client"

import { useState } from "react"
import { BusinessSidebar } from "@/components/business/sidebar"
import { DashboardOverview } from "@/components/business/dashboard-overview"
import { BookingHistory } from "@/components/business/booking-history"
import { CustomerInteractions } from "@/components/business/customer-interactions"
import { ReviewsSection } from "@/components/business/reviews-section"
import { ProfileSection } from "@/components/business/profile-section"
import { Menu, X } from "lucide-react"
import { useEffect } from "react"


export default function BusinessDashboard() {

  
  const [stats, setStats] = useState(null);

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
     .then(res => res.json())
    .then(data => setFilteredBusinesses(data));
}, []);



  const [activeSection, setActiveSection] = useState("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "bookings":
        return <BookingHistory />
      case "customers":
        return <CustomerInteractions />
      case "reviews":
        return <ReviewsSection />
      case "profile":
        return <ProfileSection />
      default:
        return <DashboardOverview />
    }
  }

  

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-md md:hidden"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <BusinessSidebar 
        activeSection={activeSection} 
        onSectionChange={(section) => {
          setActiveSection(section)
          setIsSidebarOpen(false)
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 pt-16 md:p-8 md:pt-8">
        <div className="mx-auto max-w-6xl">
          {renderSection()}
        </div>
      </main>
    </div>
  )
}
