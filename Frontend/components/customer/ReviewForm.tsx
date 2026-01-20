"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export function ReviewForm({ businessId, bookingId }: any) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        businessId,
        bookingId,
        rating,
        comment,
      }),
    });

    alert("Review submitted");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[1,2,3,4,5].map((i) => (
          <Star
            key={i}
            className={`h-6 w-6 cursor-pointer ${
              i <= rating ? "fill-primary text-primary" : "text-muted"
            }`}
            onClick={() => setRating(i)}
          />
        ))}
      </div>

      <Textarea
        placeholder="Write your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button onClick={submitReview}>Submit Review</Button>
    </div>
  );
}
