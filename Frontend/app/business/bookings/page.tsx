"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Phone, MessageCircle, Check, X, Clock, User, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface Booking {
  _id: string;
  customerId: {
    fullName: string;
    phone: string;
    email: string;
  };
  service: string;
  date: string;
  time: string;
  price: number;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "declined";
  createdAt: string;
}

export default function BusinessBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const { language } = useLanguage();

  const translations: any = {
    en: {
      bookings: "Bookings",
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      declined: "Declined",
      accept: "Accept",
      decline: "Decline",
      complete: "Complete",
      cancel: "Cancel",
      customer: "Customer",
      service: "Service",
      date: "Date",
      time: "Time",
      price: "Price",
      notes: "Notes",
      contact: "Contact",
      phone: "Call",
      whatsapp: "WhatsApp",
      noBookings: "No bookings yet",
      loading: "Loading...",
      declineReason: "Reason for decline",
      submit: "Submit",
    },
    hi: {
      bookings: "बुकिंग",
      pending: "पेंडिंग",
      confirmed: "पुष्टि की गई",
      completed: "पूर्ण",
      declined: "अस्वीकृत",
      accept: "स्वीकार करें",
      decline: "अस्वीकार करें",
      complete: "पूर्ण करें",
      cancel: "रद्द करें",
      customer: "ग्राहक",
      service: "सेवा",
      date: "तारीख",
      time: "समय",
      price: "कीमत",
      notes: "नोट्स",
      contact: "संपर्क करें",
      phone: "कॉल करें",
      whatsapp: "WhatsApp",
      noBookings: "अभी तक कोई बुकिंग नहीं",
      loading: "लोड हो रहा है...",
      declineReason: "अस्वीकार करने का कारण",
      submit: "जमा करें",
    },
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/business`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/accept`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "confirmed" } : b
          )
        );
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleDecline = async (bookingId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/decline`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: declineReason }),
        }
      );

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "declined" } : b
          )
        );
        setSelectedBooking(null);
        setDeclineReason("");
      }
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/complete`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "completed" } : b
          )
        );
      }
    } catch (error) {
      console.error("Error completing booking:", error);
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const whatsappLink = `https://wa.me/${cleanPhone}`;
    window.open(whatsappLink, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.bookings}</h1>
          <p className="text-muted-foreground">
            {bookings.length} {t.bookings.toLowerCase()}
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{t.noBookings}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User size={20} />
                        {booking.customerId.fullName}
                      </CardTitle>
                      <CardDescription>
                        {booking.service} • {booking.date} at {booking.time}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t[booking.status as keyof typeof t]}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t.service}</p>
                        <p className="font-semibold">{booking.service}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.date}</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar size={16} /> {booking.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.time}</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Clock size={16} /> {booking.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.price}</p>
                        <p className="font-semibold">₹{booking.price}</p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">{t.notes}</p>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="flex gap-2 border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(booking.customerId.phone)}
                        className="flex items-center gap-2"
                      >
                        <Phone size={16} />
                        {t.phone}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsApp(booking.customerId.phone)}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 border-t pt-4">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(booking._id)}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check size={16} />
                            {t.accept}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedBooking(booking._id)}
                            className="flex items-center gap-1"
                          >
                            <X size={16} />
                            {t.decline}
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => handleComplete(booking._id)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Check size={16} />
                          {t.complete}
                        </Button>
                      )}
                    </div>

                    {/* Decline Reason Modal */}
                    {selectedBooking === booking._id && (
                      <div className="border-t pt-4 space-y-3">
                        <textarea
                          placeholder={t.declineReason}
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="w-full p-2 border rounded-md text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDecline(booking._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t.submit}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(null);
                              setDeclineReason("");
                            }}
                          >
                            {t.cancel}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
