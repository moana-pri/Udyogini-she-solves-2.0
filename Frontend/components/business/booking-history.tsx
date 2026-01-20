"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
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
      });
  }, []);

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
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
