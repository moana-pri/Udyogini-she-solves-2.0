# 🔌 API Reference - Registration & Location

## Auth Endpoints

### Register Customer
```
POST /api/auth/register/customer
Content-Type: application/json

{
  "fullName": "Anita Sharma",
  "phone": "9876543210",
  "password": "password123",
  "preferredLanguage": "hi"
}

Response (201):
{
  "message": "Customer registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "Anita Sharma",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

### Register Business
```
POST /api/auth/register/business
Content-Type: application/json

{
  "fullName": "Priya Singh",
  "phone": "9876543211",
  "password": "secure123",
  "businessName": "Priya's Beauty Studio",
  "businessType": "Beauty Parlour",
  "location": "Koramangala, Bangalore",
  "latitude": 12.9352,
  "longitude": 77.6245,
  "workingHours": "10 AM - 7 PM",
  "priceRange": "moderate",
  "description": "Premium beauty salon with experienced staff",
  "preferredLanguage": "en"
}

Response (201):
{
  "message": "Business registered, pending approval",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fullName": "Priya Singh",
    "phone": "9876543211",
    "role": "business_owner"
  },
  "business": {
    "id": "507f1f77bcf86cd799439013",
    "businessName": "Priya's Beauty Studio"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "phone": "9876543210",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "Anita Sharma",
    "phone": "9876543210",
    "role": "customer",
    "preferredLanguage": "hi"
  }
}
```

---

## Business Endpoints

### Get Nearby Businesses
```
GET /api/business/nearby?lat=28.6139&lng=77.2090&radius=10&type=Beauty

Query Parameters:
- lat (required): User's latitude
- lng (required): User's longitude  
- radius (optional, default=50): Search radius in kilometers
- type (optional): Filter by businessType (e.g., "Beauty Parlour")

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "ownerId": "507f1f77bcf86cd799439012",
    "businessName": "Priya's Beauty Studio",
    "businessType": "Beauty Parlour",
    "location": {
      "address": "Koramangala, Bangalore",
      "lat": 12.9352,
      "lng": 77.6245
    },
    "priceRange": "moderate",
    "averageRating": 4.8,
    "totalReviews": 25,
    "distance": 2.5  // calculated distance in km
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "businessName": "Lakshmi's Kitchen",
    "businessType": "Home Food & Catering",
    "distance": 5.3
    // ... more fields
  }
]
```

### Get Business Profile (Auth Required)
```
GET /api/business/profile
Authorization: Bearer {token}

Response (200):
{
  "_id": "507f1f77bcf86cd799439013",
  "ownerId": "507f1f77bcf86cd799439012",
  "businessName": "Priya's Beauty Studio",
  "businessType": "Beauty Parlour",
  "description": "Premium beauty salon",
  "location": {
    "address": "Koramangala, Bangalore",
    "lat": 12.9352,
    "lng": 77.6245
  },
  "workingHours": "10 AM - 7 PM",
  "priceRange": "moderate",
  "phone": "9876543211",
  "averageRating": 4.8,
  "totalReviews": 25,
  "profileViews": 150,
  "createdAt": "2026-01-20T10:30:00.000Z",
  "updatedAt": "2026-01-20T10:30:00.000Z"
}
```

### Update Business Profile (Auth Required)
```
PUT /api/business/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "businessName": "Priya's Premium Studio",
  "description": "Expanded beauty salon with new services",
  "workingHours": "9 AM - 8 PM",
  "location": {
    "address": "New location",
    "lat": 12.9400,
    "lng": 77.6300
  },
  "priceRange": "premium"
}

Response (200): Updated business object
```

### Get Business Dashboard Stats (Auth Required)
```
GET /api/business/dashboard
Authorization: Bearer {token}

Response (200):
{
  "totalBookings": 45,
  "completedBookings": 38,
  "pendingBookings": 7,
  "totalCustomers": 32,
  "averageRating": 4.7,
  "bookingsThisMonth": 8
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Location (lat, lng) required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "message": "Business not found"
}
```

### 500 Server Error
```json
{
  "message": "Error details here"
}
```

---

## Frontend Integration Examples

### Get User's Nearby Businesses
```javascript
const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      reject
    );
  });
};

const fetchNearbyBusinesses = async () => {
  const location = await getUserLocation();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/business/nearby?lat=${location.lat}&lng=${location.lng}&radius=25`
  );
  return response.json();
};
```

### Save Location During Business Registration
```javascript
const handleLocationSelect = (location) => {
  setForm({
    ...form,
    latitude: location.lat,
    longitude: location.lng,
    location: location.address  // address text field
  });
};
```

### Register Business with Location
```javascript
const handleBusinessRegistration = async (formData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/business`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }
  );
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem("token", "generated_on_login");
    localStorage.setItem("role", "business_owner");
    router.push("/business/dashboard");
  }
};
```

---

## Constants

### Business Types
```javascript
const businessTypes = [
  "Beauty Parlour",
  "Tailoring & Fashion",
  "Home Food & Catering",
  "Mehendi Art",
  "Handicrafts & Jewelry",
  "Tutoring & Education",
  "Wellness & Yoga",
  "Daycare Services",
  "Other"
];
```

### Price Ranges
```javascript
const priceRanges = [
  "Budget",
  "Moderate",
  "Premium"
];
```

### Languages
```javascript
const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" }
];
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 201 | Created (success) |
| 200 | OK (success) |
| 400 | Bad Request (missing/invalid params) |
| 401 | Unauthorized (invalid credentials) |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer {token}
```

Token is returned from `/api/auth/login` and `/api/auth/register/*`

Store in localStorage:
```javascript
localStorage.setItem("token", token);
localStorage.setItem("role", user.role);
localStorage.setItem("userId", user.id);
```

---

## Important Notes

1. **Coordinates Format:**
   - Latitude: -90 to 90 (north-south)
   - Longitude: -180 to 180 (east-west)
   - Example: 28.6139°N, 77.2090°E (Delhi)

2. **Phone Number:**
   - Stored as string
   - Must be unique per user
   - No international format enforced (validate on frontend)

3. **Distance Calculation:**
   - Uses Haversine formula
   - Returns distance in kilometers
   - Accurate to ~0.5% for Earth distances

4. **Location Search:**
   - Requires both latitude and longitude
   - Radius in kilometers (default 50)
   - Results limited to 20 per request
   - Sorted by distance (closest first)
