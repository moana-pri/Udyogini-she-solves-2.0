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
      .then(setBookings);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((b: any) => (
          <div key={b._id} className="border p-4 rounded">
            <p><b>Customer:</b> {b.customerId.fullName}</p>
            <p><b>Phone:</b> {b.customerId.phone}</p>
            <p><b>Service:</b> {b.service}</p>
            <p><b>Date:</b> {b.date} {b.time}</p>
            <Badge>{b.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
