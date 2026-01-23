"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Calendar, TrendingUp } from "lucide-react";
import { LanguageProvider } from "@/lib/enhanced-language-context";
import { EnhancedLanguageSelector } from "@/components/ui/enhanced-language-selector";
import { useLanguage } from "@/lib/enhanced-language-context";
import { BusinessCardImage } from "@/components/ui/business-card-image";

export default function CustomerHome() {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  // Mock businesses for testing photo system
  const mockBusinesses = [
    {
      _id: "1",
      businessName: "Stitch Perfect",
      businessType: "Tailoring",
      businessDescription: "Professional tailoring and alteration services",
      location: { address: "Mumbai, Maharashtra" },
      averageRating: 4.5
    },
    {
      _id: "2", 
      businessName: "Homely Kitchen",
      businessType: "Home Food",
      businessDescription: "Delicious homemade food and tiffin services",
      location: { address: "Pune, Maharashtra" },
      averageRating: 4.8
    },
    {
      _id: "3",
      businessName: "Mehendi Arts",
      businessType: "Mehendi", 
      businessDescription: "Beautiful mehendi designs for all occasions",
      location: { address: "Nagpur, Maharashtra" },
      averageRating: 4.7
    },
    {
      _id: "4",
      businessName: "Beauty Bliss",
      businessType: "Beauty Parlour",
      businessDescription: "Complete beauty and wellness services",
      location: { address: "Nashik, Maharashtra" },
      averageRating: 4.6
    }
  ];

  // Initialize with mock businesses for testing
  useEffect(() => {
    // Start with mock businesses to test photo system
    setNearbyBusinesses(mockBusinesses);
  }, []);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!searchLocation.trim()) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      let searchUrl = `${apiUrl}/api/business/nearby?`;
      const params = new URLSearchParams();
      
      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
        params.append('radius', '10');
      } else {
        params.append('location', searchLocation);
      }
      
      searchUrl += params.toString();

      const response = await fetch(searchUrl);
      const data = await response.json();
      console.log('Business search results:', data);
      setNearbyBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setSearchLocation(`${userLocation.lat}, ${userLocation.lng}`);
      handleSearch();
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">{t('welcome')}</h1>
                <EnhancedLanguageSelector />
              </div>
              <nav className="hidden md:flex space-x-8">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/customer/bookings')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('my_bookings')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/customer/dashboard')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {t('reviews')}
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('search_services')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder={t('search_location') || "Enter location or service..."}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Searching...' : t('search')}
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleUseCurrentLocation}
                  disabled={!userLocation}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('use_current_location')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Section - Mock Businesses with Photos */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Business Type Photos Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Testing business type photo system with sample businesses:
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {mockBusinesses.map((business, index) => (
                  <Card key={business._id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    <BusinessCardImage 
                      businessType={business.businessType}
                      businessName={business.businessName}
                      businessId={business._id}
                      priority={index < 2}
                    />
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">{business.businessName}</h4>
                      <p className="text-xs text-gray-600">{business.businessType}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{business.averageRating}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('bookings')}</h3>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('reviews')}</h3>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Given</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Services Used</h3>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Different types</p>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Businesses */}
          {nearbyBusinesses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('nearby_businesses')}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {nearbyBusinesses.map((business: any, index: number) => (
                  <Card key={business._id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    {/* Business Type Image */}
                    <BusinessCardImage 
                      businessType={business.businessType}
                      businessName={business.businessName}
                      businessId={business._id}
                      priority={index < 3} // Prioritize loading for first 3 images
                    />
                    
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{business.businessName}</h3>
                        {business.averageRating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{business.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2 line-clamp-2">{business.businessDescription}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{business.businessType}</span>
                        <span>•</span>
                        <span>{business.location?.address}</span>
                      </div>
                      
                      <Button 
                        onClick={() => router.push(`/customer/booking/${business._id}`)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      >
                        {t('book_now')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {nearbyBusinesses.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or location</p>
                <Button onClick={() => setSearchLocation("")} variant="outline">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </LanguageProvider>
  );
}
