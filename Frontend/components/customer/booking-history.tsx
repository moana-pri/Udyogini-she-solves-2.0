"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingHistoryProps {
  onReviewClick?: (bookingId: string) => void;
}

export function BookingHistory({ onReviewClick }: BookingHistoryProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/customer`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  const getStatusBadge = (status: string) => {
    const map: any = {
      completed: "bg-green-100 text-green-700",
      upcoming: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return <Badge className={map[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Bookings</h2>

      {bookings.length === 0 && (
        <p className="text-muted-foreground">No bookings yet.</p>
      )}

      {bookings.map((b) => (
        <Card key={b._id} className="border-border/50">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between">
              <h3 className="font-medium">
                {b.businessId.businessName}
              </h3>
              {getStatusBadge(b.status)}
            </div>

            <p className="text-sm text-primary">{b.service}</p>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {b.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {b.time}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              {b.businessId.location?.address || "Location not available"}
            </div>

            <div className="flex gap-2 pt-2">
              {b.status === "completed" && !b.reviewed && (
                <Button size="sm" onClick={() => onReviewClick?.(b._id)}>
                  <Star className="h-4 w-4 mr-1" />
                  Leave Review
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(`tel:${b.businessId.phone}`, "_self")
                }
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
