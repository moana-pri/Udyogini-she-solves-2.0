"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReviewsSection({ businessId, onDone }: any) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          businessId,
          rating,
          comment,
        }),
      }
    );

    if (res.ok) {
      onDone?.();
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        className="border w-full p-2"
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={submitReview}>Submit Review</Button>
    </div>
  );
}
