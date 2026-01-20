"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/business/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">{stats.completedBookings}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">{stats.pendingBookings}</p>
        </CardContent>
      </Card>
    </div>
  );
}
