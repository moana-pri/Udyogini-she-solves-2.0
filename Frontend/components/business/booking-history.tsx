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

  const fetchBookings = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/business`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
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
        setBookings([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, action: 'accept' | 'decline' | 'complete') => {
    try {
      const endpoint = action === 'accept' ? 'accept' : action === 'decline' ? 'decline' : 'complete';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/${endpoint}`, {
        method: action === 'decline' ? 'PUT' : 'PUT',
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
        {bookings.length === 0 ? (
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
