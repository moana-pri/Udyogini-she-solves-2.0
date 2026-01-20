"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function BusinessBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/business`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    setBookings(prev =>
      prev.map(b =>
        b._id === id ? { ...b, status } : b
      )
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Bookings</h1>

      {bookings.map((b: any) => (
        <div
          key={b._id}
          className="flex justify-between items-center border rounded-lg p-4"
        >
          <div>
            <p className="font-medium">{b.customerId.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {b.serviceName} • {b.time}
            </p>
            <p className="text-xs">Status: {b.status}</p>
          </div>

          <div className="flex gap-2">
            {b.status === "pending" && (
              <>
                <Button onClick={() => updateStatus(b._id, "confirmed")}>
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateStatus(b._id, "cancelled")}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
