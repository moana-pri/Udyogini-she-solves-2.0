"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";

interface Booking {
  _id: string;
  customerId: {
    fullName: string;
    phone: string;
  };
  service: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchBookings = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Fetching bookings from:', `${apiUrl}/api/bookings/business`);
    
    // First test if the server is accessible
    fetch(`${apiUrl}/`)
      .then(res => {
        console.log('Server test response:', res.status);
        if (!res.ok) {
          throw new Error(`Server not accessible: ${res.status}`);
        }
        return res.text();
      })
      .then(() => {
        // If server is accessible, then fetch bookings
        return fetch(`${apiUrl}/api/bookings/business`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      })
      .then((res) => {
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        if (res.ok) {
          return res.json();
        } else {
          return res.text().then(text => {
            console.error('Error response body:', text);
            const errorData = JSON.parse(text);
            
            // Check if it's a role mismatch error
            if (errorData.message && errorData.message.includes('Access denied')) {
              console.error('Role mismatch detected - redirecting to customer dashboard');
              setAuthError('You are logged in as a customer. Redirecting to customer dashboard...');
              setTimeout(() => {
                window.location.href = '/customer/dashboard';
              }, 2000);
              return;
            }
            
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          });
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Expected array of bookings, got:", data);
          setBookings([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error("Network error - backend might not be accessible");
        }
        // Show user-friendly error message
        setBookings([]);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, action: 'accept' | 'decline' | 'complete') => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = action === 'accept' ? 'accept' : action === 'decline' ? 'decline' : 'complete';
      const res = await fetch(`${apiUrl}/api/bookings/${bookingId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: action === 'decline' ? JSON.stringify({ reason: "Declined by business owner" }) : undefined,
      });

      if (res.ok) {
        // Refresh bookings
        fetchBookings();
      } else {
        console.error("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {authError && (
          <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
            {authError}
          </div>
        )}
        {bookings.length === 0 && !authError ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          bookings.map((b: any) => (
            <div key={b._id} className="border p-4 rounded-lg space-y-2 bg-gray-50">
              <p><b>Customer:</b> {b.customerId?.fullName || "Unknown"}</p>
              <p><b>Phone:</b> {b.customerId?.phone || "N/A"}</p>
              <p><b>Service:</b> {b.service || "N/A"}</p>
              <p><b>Date & Time:</b> {b.date} {b.time}</p>
              {b.notes && <p><b>Notes:</b> {b.notes}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <b>Status:</b>
                  <Badge className={
                    b.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : b.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : b.status === "confirmed"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-red-200 text-red-800"
                  }>
                    {b.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {b.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(b._id, 'accept')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(b._id, 'decline')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(b._id, 'complete')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
