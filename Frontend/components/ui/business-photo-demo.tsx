"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessCardImage } from "@/components/ui/business-card-image";
import { Button } from "@/components/ui/button";

// Sample business types for testing
const sampleBusinesses = [
  { businessType: "Tailoring", businessName: "Stitch Perfect" },
  { businessType: "Home Food", businessName: "Homely Kitchen" },
  { businessType: "Mehendi", businessName: "Mehendi Arts" },
  { businessType: "Handicrafts", businessName: "Craft Corner" },
  { businessType: "Beauty Parlour", businessName: "Beauty Bliss" },
  { businessType: "Catering", businessName: "Catering Services" },
  { businessType: "Jewelry Making", businessName: "Sparkle Jewels" },
  { businessType: "Tuition", businessName: "Learn & Grow" }
];

export function BusinessPhotoDemo() {
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  const currentBusiness = sampleBusinesses[currentBusinessIndex];

  const nextBusiness = () => {
    setCurrentBusinessIndex((prev) => (prev + 1) % sampleBusinesses.length);
  };

  const prevBusiness = () => {
    setCurrentBusinessIndex((prev) => (prev - 1 + sampleBusinesses.length) % sampleBusinesses.length);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Business Type Photo Demo</h3>
          
          {/* Business Card with Photo */}
          <div className="max-w-sm mx-auto">
            <Card className="overflow-hidden">
              <BusinessCardImage 
                businessType={currentBusiness.businessType}
                businessName={currentBusiness.businessName}
                priority={true}
              />
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentBusiness.businessName}
                </h4>
                <p className="text-gray-600 mb-4">
                  Business Type: <strong>{currentBusiness.businessType}</strong>
                </p>
                <div className="flex gap-2">
                  <Button onClick={prevBusiness} variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button onClick={nextBusiness} size="sm">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Type List */}
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-3">All Business Types:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sampleBusinesses.map((business, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBusinessIndex(index)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    index === currentBusinessIndex
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {business.businessType}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-3">How It Works:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Each business type has a specific photo assigned</li>
            <li>• The system automatically matches business types to photos</li>
            <li>• Supports exact matches and partial matches</li>
            <li>• Falls back to default photo for unknown types</li>
            <li>• Currently using Unsplash photos for testing</li>
            <li>• Replace with your own photos in the future</li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Next Step:</strong> Add your own photos to <code>public/images/business-types/</code> 
              and update the photo URLs in <code>lib/business-type-photos.ts</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
