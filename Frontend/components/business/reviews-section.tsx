"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/reviews/owner/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setReviews(data)
          if (data.length > 0) {
            const avgRating = data.reduce((sum: number, r: any) => sum + r.rating, 0) / data.length
            setStats({
              average: avgRating,
              total: data.length,
            })
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }))

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
              <p className="text-5xl font-bold text-foreground">{stats.average.toFixed(1)}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(stats.average) ? 'fill-primary text-primary' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on {stats.total} reviews
              </p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="w-3 text-sm text-muted-foreground">{item.rating}</span>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(item.count / Math.max(...ratingDistribution.map(r => r.count), 1)) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
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
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div 
                    key={review._id}
                    className="rounded-xl border border-border/50 bg-card p-4"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{review.customerId?.fullName || "Customer"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
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
                      {review.comment || "No comment"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
