"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function ReviewsList({ businessId }: any) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/business/${businessId}`)
      .then((res) => res.json())
      .then(setReviews);
  }, [businessId]);

  return (
    <div className="space-y-4">
      {reviews.map((r: any) => (
        <div key={r._id} className="border p-4 rounded">
          <p className="font-medium">{r.customerId.fullName}</p>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < r.rating ? "fill-primary text-primary" : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
