"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, DollarSign, Star, Clock, Bell, IndianRupee } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [weeklyIncome, setWeeklyIncome] = useState<any[]>([]);
  const [incomeStats, setIncomeStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem("token");

    const fetchAll = () => {
      // Fetch stats
      fetch(`${apiUrl}/api/business/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(setStats)
        .catch(err => console.error('Error fetching stats:', err));

      // Fetch notifications count
      fetch(`${apiUrl}/api/business/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setNotificationCount(data.count || 0))
        .catch(err => console.error('Error fetching notifications:', err));

      // Fetch weekly stats
      fetch(`${apiUrl}/api/business/weekly-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setWeeklyStats(data || []))
        .catch(err => console.error('Error fetching weekly stats:', err));

      // Fetch weekly income stats
      fetch(`${apiUrl}/api/business/weekly-income`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setWeeklyIncome(data || []))
        .catch(err => console.error('Error fetching weekly income:', err));

      // Fetch income stats
      fetch(`${apiUrl}/api/business/income-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setIncomeStats(data || {}))
        .catch(err => console.error('Error fetching income stats:', err));

      // Fetch recent bookings
      fetch(`${apiUrl}/api/bookings/business`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setRecentBookings(data.slice(0, 5));
        })
        .catch(err => console.error('Error fetching recent bookings:', err))
        .finally(() => setLoading(false));
    };

    // initial load
    fetchAll();

    // refresh when bookings are updated elsewhere
    const handler = () => fetchAll();
    window.addEventListener('bookingUpdated', handler as EventListener);

    return () => {
      window.removeEventListener('bookingUpdated', handler as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Badge + Stats Cards + Income Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Notification Card */}
        <Card className="lg:col-span-1 relative">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{notificationCount}</p>
              </div>
              <div className="relative">
                <Bell className="h-8 w-8 text-primary" />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Cards */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Income</p>
                <p className="text-2xl font-bold">₹{incomeStats?.todayIncome || 0}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₹{incomeStats?.monthIncome || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold">₹{incomeStats?.totalIncome || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Income</p>
                <p className="text-2xl font-bold">₹{incomeStats?.averageIncome || 0}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('total_bookings')}</p>
                <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('completed_bookings')}</p>
                <p className="text-2xl font-bold">{stats?.completedBookings || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('pending_bookings')}</p>
                <p className="text-2xl font-bold">{stats?.pendingBookings || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Booking Chart */}
      {weeklyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Bar dataKey="totalBookings" fill="#ec4899" name="Bookings" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Weekly Income Chart */}
      {weeklyIncome.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Weekly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyIncome} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  formatter={(value) => `₹${value}`}
                />
                <Legend />
                <Bar dataKey="totalIncome" fill="#10b981" name="Income (₹)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t('no_bookings_yet')}</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{booking.customerId?.fullName || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                      <div className="text-right">
                        {booking.status === 'completed' && (
                          <p className="text-sm text-green-700 font-semibold">Amount: ₹{typeof booking.amountReceived !== 'undefined' ? booking.amountReceived : 0}</p>
                        )}
                        <Badge className={
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {booking.status}
                        </Badge>
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
