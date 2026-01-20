"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function DebugRegisterPage() {
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const testRegistration = async () => {
    setError("")
    setResponse(null)

    try {
      const testData = {
        fullName: "Test Business",
        phone: "9876543210",
        password: "Test@1234",
        businessName: "Test Beauty Salon",
        businessType: "Beauty Parlour",
        location: "Test Location Address",
        latitude: 12.9352,
        longitude: 77.6245,
        workingHours: "9 AM - 6 PM",
        priceRange: "₹500 - ₹1000",
        description: "A test business",
        preferredLanguage: "en",
      }

      console.log("Sending data:", testData)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      const data = await res.json()

      console.log("Response status:", res.status)
      console.log("Response data:", data)

      if (!res.ok) {
        setError(`Error: ${data.message || "Unknown error"}`)
      }

      setResponse(data)
    } catch (err) {
      console.error("Error:", err)
      setError(`${err}`)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">🔍 Debug Registration API</h1>

            <button
              onClick={testRegistration}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-6"
            >
              Test Business Registration
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">❌ Error:</p>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            )}

            {response && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">✅ Response:</p>
                <pre className="text-xs bg-white p-4 rounded mt-2 overflow-auto max-h-96 border border-green-200">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
