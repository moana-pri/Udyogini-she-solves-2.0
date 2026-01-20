"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface BookingHistoryProps {
  onReviewClick?: (bookingId: string) => void;
}

export function BookingHistory({ onReviewClick }: BookingHistoryProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const handleSubmitReview = async () => {
    if (!reviewingBookingId) return;

    const reviewingBooking = bookings.find(b => b._id === reviewingBookingId);
    if (!reviewingBooking) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          businessId: reviewingBooking.businessId._id,
          bookingId: reviewingBookingId,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        // Mark booking as reviewed
        setBookings(bookings.map(b => 
          b._id === reviewingBookingId 
            ? { ...b, reviewed: true } 
            : b
        ));
        setReviewingBookingId(null);
        setRating(5);
        setComment("");
        alert("Review submitted successfully!");
      } else {
        alert("Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  const getStatusBadge = (status: string) => {
    const map: any = {
      completed: "bg-green-100 text-green-700",
      confirmed: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
      declined: "bg-red-100 text-red-700",
    };
    return <Badge className={map[status] || "bg-gray-100 text-gray-700"}>{status}</Badge>;
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Bookings</h2>

        {bookings.length === 0 && (
          <p className="text-muted-foreground">No bookings yet.</p>
        )}

        {bookings.map((b) => (
          <Card key={b._id} className="border-border/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {b.businessId?.businessName || b.businessName || "Business"}
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
                {b.businessId?.location?.address || b.businessId?.location || "Location not available"}
              </div>

              {b.notes && (
                <div className="text-sm text-muted-foreground pt-2">
                  <strong>Notes:</strong> {b.notes}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {b.status === "completed" && !b.reviewed && (
                  <Button 
                    size="sm" 
                    onClick={() => setReviewingBookingId(b._id)}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Leave Review
                  </Button>
                )}
                {b.status === "completed" && b.reviewed && (
                  <span className="text-sm text-green-600 font-medium">✓ Review submitted</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewingBookingId !== null} onOpenChange={(open) => {
        if (!open) {
          setReviewingBookingId(null);
          setRating(5);
          setComment("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium">Your Feedback</label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setReviewingBookingId(null);
                  setRating(5);
                  setComment("");
                }}
                disabled={submittingReview}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
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
