"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, TrendingUp } from "lucide-react"

const reviews = [
  {
    id: 1,
    customer: "Anita Sharma",
    rating: 5,
    comment: "Amazing service! Priya is very skilled and professional. The parlour is clean and welcoming. Highly recommend for anyone looking for quality beauty services.",
    date: "Jan 18, 2026",
    service: "Haircut & Styling",
  },
  {
    id: 2,
    customer: "Meera Singh",
    rating: 4,
    comment: "Good work on my hair coloring. The color turned out exactly as I wanted. Slightly delayed but worth the wait.",
    date: "Jan 15, 2026",
    service: "Hair Coloring",
  },
  {
    id: 3,
    customer: "Lakshmi Nair",
    rating: 5,
    comment: "Best bridal makeup artist in the area! Made me feel so beautiful on my special day. Thank you so much!",
    date: "Jan 12, 2026",
    service: "Bridal Makeup",
  },
  {
    id: 4,
    customer: "Kavitha Reddy",
    rating: 5,
    comment: "Very relaxing facial treatment. My skin feels so refreshed and rejuvenated. Will definitely come back!",
    date: "Jan 10, 2026",
    service: "Facial Treatment",
  },
  {
    id: 5,
    customer: "Priya Patel",
    rating: 4,
    comment: "Good manicure and pedicure service. Friendly staff and reasonable prices.",
    date: "Jan 8, 2026",
    service: "Manicure & Pedicure",
  },
]

const ratingStats = {
  average: 4.8,
  total: 124,
  distribution: [
    { stars: 5, count: 89, percentage: 72 },
    { stars: 4, count: 25, percentage: 20 },
    { stars: 3, count: 7, percentage: 6 },
    { stars: 2, count: 2, percentage: 1.5 },
    { stars: 1, count: 1, percentage: 0.5 },
  ],
}

export function ReviewsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="mb-2 text-2xl font-bold text-foreground md:text-3xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Reviews & Ratings
        </h1>
        <p className="text-muted-foreground">See what your customers are saying</p>
      </div>

      {/* Rating Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Rating Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-center">
              <p className="text-5xl font-bold text-foreground">{ratingStats.average}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(ratingStats.average) ? 'fill-primary text-primary' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on {ratingStats.total} reviews
              </p>
            </div>

            <div className="space-y-2">
              {ratingStats.distribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="w-3 text-sm text-muted-foreground">{item.stars}</span>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                +0.2 from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Customer Reviews
            </CardTitle>
            <CardDescription>
              Recent feedback from your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="rounded-xl border border-border/50 bg-card p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{review.customer}</p>
                      <p className="text-xs text-muted-foreground">{review.service}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
