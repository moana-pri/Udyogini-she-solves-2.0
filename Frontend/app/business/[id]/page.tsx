"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/${id}/customer`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setBusiness);
  }, [id]);

  if (!business) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{business.businessName}</h1>
          <p className="text-muted-foreground">{business.businessType}</p>

          <p>{business.description}</p>

          <div className="flex gap-3">
            <Button onClick={() => window.open(`tel:${business.phone}`)}>
              Call
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(`https://wa.me/${business.phone}`, "_blank")
              }
            >
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
