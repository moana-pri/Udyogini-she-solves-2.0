"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";
import { useLanguage } from "@/lib/enhanced-language-context";
import { BookingCompletionModal } from "./booking-completion-modal";
import { BookingDeclineModal } from "./booking-decline-modal";

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
  amountReceived?: number;
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [completionModal, setCompletionModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    service: string;
  }>({ isOpen: false, bookingId: "", service: "" });
  const [declineModal, setDeclineModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    customerName: string;
    service: string;
  }>({ isOpen: false, bookingId: "", customerName: "", service: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

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
            let errorData: any = { message: text };
            try {
              errorData = JSON.parse(text);
            } catch (e) {
              // keep raw text if JSON parse fails
            }

            // Check if it's a role mismatch error
            if (errorData.message && errorData.message.includes('Access denied')) {
              console.error('Role mismatch detected - redirecting to customer dashboard');
              setAuthError('You are logged in as a customer. Redirecting to customer dashboard...');
              setTimeout(() => {
                window.location.href = '/customer/dashboard';
              }, 2000);
              return;
            }

            // If the business isn't found for this business owner, guide them to register
            if (errorData.message && errorData.message.includes('Business not found')) {
              console.warn('Business not found for current user - redirecting to business registration');
              setAuthError('No business profile found. Redirecting to business registration...');
              setTimeout(() => {
                window.location.href = '/register/business';
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

  const handleStatusUpdate = async (bookingId: string, action: 'accept' | 'decline' | 'complete', amount?: number, reason?: string) => {
    try {
      setIsSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = action === 'accept' ? 'accept' : action === 'decline' ? 'decline' : 'complete';
      
      const body = action === 'decline' && reason
        ? { reason }
        : action === 'complete' && amount !== undefined
        ? { amountReceived: amount }
        : undefined;

      const res = await fetch(`${apiUrl}/api/bookings/${bookingId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.ok) {
        // Refresh bookings
        fetchBookings();
        // Notify other parts of the app to refresh (dashboard, stats)
        try {
          window.dispatchEvent(new CustomEvent('bookingUpdated'));
        } catch (e) {
          console.warn('Could not dispatch bookingUpdated event', e);
        }
      } else {
        console.error("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BookingCompletionModal
        isOpen={completionModal.isOpen}
        bookingId={completionModal.bookingId}
        bookingService={completionModal.service}
        onClose={() => setCompletionModal({ isOpen: false, bookingId: "", service: "" })}
        onConfirm={async (bookingId, amount) => {
          await handleStatusUpdate(bookingId, 'complete', amount);
        }}
        isLoading={isSubmitting}
      />

      <BookingDeclineModal
        isOpen={declineModal.isOpen}
        bookingId={declineModal.bookingId}
        customerName={declineModal.customerName}
        service={declineModal.service}
        onClose={() => setDeclineModal({ isOpen: false, bookingId: "", customerName: "", service: "" })}
        onConfirm={async (bookingId, reason) => {
          await handleStatusUpdate(bookingId, 'decline', undefined, reason);
          setDeclineModal({ isOpen: false, bookingId: "", customerName: "", service: "" });
        }}
        isLoading={isSubmitting}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('bookings')} ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError && (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
              {authError}
            </div>
          )}
          {bookings.length === 0 && !authError ? (
            <p className="text-gray-500">{t('no_bookings_yet')}</p>
          ) : (
            bookings.map((b: any) => (
              <div key={b._id} className="border p-4 rounded-lg space-y-2 bg-gray-50">
                <p><b>{t('customer')}:</b> {b.customerId?.fullName || "Unknown"}</p>
                <p><b>{t('phone')}:</b> {b.customerId?.phone || "N/A"}</p>
                <p><b>{t('service')}:</b> {b.service || "N/A"}</p>
                <p><b>{t('date')} & {t('time')}:</b> {b.date} {b.time}</p>
                {b.notes && <p><b>{t('notes')}:</b> {b.notes}</p>}
                {b.status === 'declined' && b.declinedReason && (
                  <p><b>Decline Reason:</b> {b.declinedReason}</p>
                )}
                {b.status === "completed" && (
                  <p><b>Amount Received:</b> ₹{typeof b.amountReceived !== 'undefined' ? b.amountReceived : 0}</p>
                )}
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
                          disabled={isSubmitting}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('accept')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeclineModal({
                            isOpen: true,
                            bookingId: b._id,
                            customerName: b.customerId?.fullName || "Customer",
                            service: b.service
                          })}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t('decline')}
                        </Button>
                      </>
                    )}
                    {b.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => setCompletionModal({ 
                          isOpen: true, 
                          bookingId: b._id, 
                          service: b.service 
                        })}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        {t('complete')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
