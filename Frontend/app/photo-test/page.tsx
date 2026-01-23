"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessCardImage } from "@/components/ui/business-card-image";
import { getBusinessTypePhoto } from "@/lib/businessTypePhotos";

const testBusinessTypes = [
  "Tailoring",
  "Home Food", 
  "Mehendi",
  "Beauty Parlour",
  "Handicrafts",
  "Catering",
  "Jewelry Making",
  "Tuition"
];

export default function PhotoTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentType = testBusinessTypes[currentIndex];

  const nextType = () => {
    setCurrentIndex((prev) => (prev + 1) % testBusinessTypes.length);
  };

  const prevType = () => {
    setCurrentIndex((prev) => (prev - 1 + testBusinessTypes.length) % testBusinessTypes.length);
  };

  const selectedPhoto = getBusinessTypePhoto(currentType);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Business Type Photo Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Business Type */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{currentType}</h2>
              <p className="text-gray-600 mb-4">Photo URL: {selectedPhoto?.photoUrl}</p>
            </div>

            {/* Business Card Image */}
            <div className="max-w-sm mx-auto">
              <Card className="overflow-hidden">
                <BusinessCardImage 
                  businessType={currentType}
                  businessName={`Test ${currentType} Business`}
                  priority={true}
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold">Test {currentType} Business</h3>
                  <p className="text-sm text-gray-600">Sample business for testing</p>
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <Button onClick={prevType} variant="outline">
                Previous
              </Button>
              <Button onClick={nextType}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Business Types Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Business Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {testBusinessTypes.map((type, index) => (
                <button
                  key={type}
                  onClick={() => setCurrentIndex(index)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    index === currentIndex
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-sm">{type}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Current Index:</strong> {currentIndex}</p>
              <p><strong>Current Type:</strong> {currentType}</p>
              <p><strong>Photo Found:</strong> {selectedPhoto ? 'Yes' : 'No'}</p>
              {selectedPhoto && (
                <>
                  <p><strong>Photo URL:</strong> {selectedPhoto.photoUrl}</p>
                  <p><strong>Category:</strong> {selectedPhoto.category}</p>
                  <p><strong>Alt Text:</strong> {selectedPhoto.altText}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
