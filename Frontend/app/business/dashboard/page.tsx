"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BusinessSidebar } from "@/components/business/sidebar"
import { DashboardOverview } from "@/components/business/dashboard-overview"
import { BookingHistory } from "@/components/business/booking-history"
import { CustomerInteractions } from "@/components/business/customer-interactions"
import { ReviewsSection } from "@/components/business/reviews-section"
import { ProfileSection } from "@/components/business/profile-section"
import { Menu, X } from "lucide-react"


export default function BusinessDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(null);
  const [activeSection, setActiveSection] = useState("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        // Verify user is a business owner
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          router.push("/login")
          return
        }

        const userData = await res.json()
        console.log('User data:', userData);
        if (userData.role !== "business_owner") {
          console.log('User is not a business owner, redirecting to customer dashboard');
          router.push("/customer/dashboard")
          return
        }

        setIsAuthenticated(true)
        setIsLoading(false)

        // Fetch stats after authentication
        fetch(`${apiUrl}/api/business/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then(setStats)
          .catch(err => console.error('Error fetching stats:', err));
      } catch (err) {
        console.error("Auth check failed:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

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
