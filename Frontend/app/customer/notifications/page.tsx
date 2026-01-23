"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Error marking read', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n._id} className={`p-4 border rounded ${n.read ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {!n.read && (
                        <Button size="sm" onClick={() => markRead(n._id)}>Mark as read</Button>
                      )}
                      <a href={`/customer/bookings`} className="text-xs text-blue-600">My Bookings</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
