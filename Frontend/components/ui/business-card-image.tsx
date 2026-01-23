"use client";

import Image from "next/image";
import { useState } from "react";
import { getBusinessTypePhoto } from "@/lib/businessTypePhotos";
import { Building2, Loader2 } from "lucide-react";

interface BusinessCardImageProps {
  businessType: string;
  businessName: string;
  className?: string;
  priority?: boolean;
  businessId?: string | number;
}

export function BusinessCardImage({ 
  businessType, 
  businessName, 
  className = "",
  priority = false,
  businessId
}: BusinessCardImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentPhoto, setCurrentPhoto] = useState({
  photoUrl: "/placeholder.jpg",
  altText: "Placeholder image"
});


  // Get the appropriate photo for this business type
  const businessPhoto = getBusinessTypePhoto(businessType || '', businessId) || {
  photoUrl: "/placeholder-logo.png",
  altText: "Default business image"
};

  
  console.log('BusinessCardImage props:', { businessType, businessName });
  console.log('Selected photo:', businessPhoto);

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageState('loaded');
  };

  const handleImageError = () => {
    console.log('Image failed to load, using fallback');
    setImageState('error');
    // Fallback to default photo
    setCurrentPhoto({
  photoUrl: "/placeholder-logo.png",
  altText: "Default business image"
});

  };

  return (
    <div className={`relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Loading State */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {imageState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Image not available</p>
          </div>
        </div>
      )}

      {/* Business Type Photo */}
      <Image
        src={imageState === 'error' ? currentPhoto.photoUrl : businessPhoto.photoUrl}
        alt={businessPhoto.altText || `${businessName} - ${businessType}`}
        fill
        className={`object-cover transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Business Type Badge */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
        {businessType}
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
