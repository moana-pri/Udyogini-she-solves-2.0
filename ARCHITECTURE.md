# 🏗️ She_Solves Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Next.js 16.0.10 (Frontend) on :3000            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌─────────────────┐      ┌──────────────────┐         │   │
│  │  │    Customer     │      │   Business Owner │         │   │
│  │  │   Dashboard     │      │    Dashboard     │         │   │
│  │  └────────┬────────┘      └────────┬─────────┘         │   │
│  │           │                        │                   │   │
│  │  ┌────────▼────────┐      ┌────────▼─────────┐         │   │
│  │  │   Language      │      │   Language       │         │   │
│  │  │  Switcher       │      │   Switcher       │         │   │
│  │  │  (7 Languages)  │      │  (7 Languages)   │         │   │
│  │  └────────┬────────┘      └────────┬─────────┘         │   │
│  │           │                        │                   │   │
│  │  ┌────────▼────────────────────────▼─────────┐         │   │
│  │  │   React Context (Language State)           │         │   │
│  │  │   - Persisted in localStorage              │         │   │
│  │  │   - Available to all components            │         │   │
│  │  └────────┬─────────────────────────────────┘         │   │
│  │           │                                           │   │
│  │  ┌────────▼──────────────────────────────────┐        │   │
│  │  │      useTranslation() Hook                 │        │   │
│  │  │  - translate(text, language)              │        │   │
│  │  │  - translateMany(texts, language)         │        │   │
│  │  │  - Error handling & fallback              │        │   │
│  │  └────────┬──────────────────────────────────┘        │   │
│  │           │                                           │   │
│  │  ┌────────▼──────────────────────────────────┐        │   │
│  │  │   translate-api.ts                         │        │   │
│  │  │  - API calls to backend                   │        │   │
│  │  │  - Error handling                         │        │   │
│  │  │  - Response formatting                    │        │   │
│  │  └────────┬──────────────────────────────────┘        │   │
│  │           │                                           │   │
│  └───────────┼───────────────────────────────────────────┘   │
│              │                                                │
└──────────────┼────────────────────────────────────────────────┘
               │
        ┌──────▼──────┐
        │  HTTP/HTTPS │
        │   (Axios)   │
        └──────┬──────┘
               │
┌──────────────▼────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│    Express.js Server on :5000 (CORS Enabled)                 │
│                                                                │
└──────────────┬────────────────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Auth  │ │Business│ │Booking │ │ Review │ │Translate│
│ Routes │ │ Routes │ │ Routes │ │ Routes │ │ Routes  │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
    │          │          │          │          │
    └──────────┼──────────┼──────────┼──────────┘
               │
        ┌──────▼──────┐
        │ Middleware  │
        │ - Auth      │
        │ - CORS      │
        │ - Logging   │
        └──────┬──────┘
               │
┌──────────────▼────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Auth         │  │Business      │  │Booking       │         │
│  │Controller   │  │Controller    │  │Controller    │         │
│  └─────────────┘  └──────────────┘  └──────────────┘         │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Review        │  │Dashboard     │  │Translation   │         │
│  │Controller    │  │Controller    │  │Utility       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                │
│  Key Functions:                                               │
│  - Authentication (JWT)                                       │
│  - Business search (with 5km radius filtering)               │
│  - Booking management                                        │
│  - Review processing                                         │
│  - Translation via LibreTranslate API                        │
│                                                                │
└──────────────┬────────────────────────────────────────────────┘
               │
┌──────────────▼────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Mongoose Models & Schemas                    │    │
│  │                                                      │    │
│  │  - User (authentication, profile)                  │    │
│  │  - Business (profile, owner info)                 │    │
│  │  - Businessloc (locations with GeoJSON)          │    │
│  │  - Booking (customer-business bookings)          │    │
│  │  - Review (feedback and ratings)                 │    │
│  │                                                      │    │
│  └────────────────┬─────────────────────────────────┘    │
│                   │                                       │
└───────────────────┼───────────────────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │   MongoDB Database  │
         │   (Local or Atlas)  │
         │                     │
         │  Collections:       │
         │  - users            │
         │  - businesses       │
         │  - businesslocs     │
         │  - bookings         │
         │  - reviews          │
         │                     │
         │  GeoJSON Index:     │
         │  - Enables 5km      │
         │    radius search    │
         │                     │
         └─────────────────────┘
```

## Data Flow Diagrams

### Translation Flow
```
User Input (English)
    │
    ▼
Language Context
    │ ─── localStorage (persistence)
    │
    ▼
useTranslation() Hook
    │
    ▼
translate-api.ts
    │ (HTTP POST)
    ▼
Backend: POST /api/translate
    │
    ▼
Translation Controller
    │
    ▼
LibreTranslate API (https://libretranslate.de)
    │
    ▼
Hindi/Marathi/Tamil/etc. Translation
    │ (caching enabled)
    ▼
Response to Frontend
    │ (original text if error)
    ▼
Update Component UI
    │
    ▼
User sees translated content
```

### Location Search Flow
```
User Clicks "Enable Location"
    │
    ▼
Browser Geolocation API
    │ (asks permission)
    ▼
User Grants Permission
    │
    ▼
Get Current GPS Coordinates
    │ (latitude, longitude)
    │
    ▼
User Clicks "Search Nearby"
    │
    ▼
Call API: GET /api/business/nearby?lat=X&lng=Y&radius=5
    │
    ▼
Backend: businessRoutes → businessController
    │
    ▼
MongoDB GeoJSON Query
    │ (finds all docs within 5km)
    │
    ▼
Haversine Distance Calculation
    │
    ▼
Sort by Distance (nearest first)
    │
    ▼
Return results with distance
    │
    ▼
Frontend: Display on map/cards
    │
    ▼
User sees "X km away" for each business
```

### Booking Creation Flow
```
Customer Views Business
    │
    ▼
Fill Booking Form
    │
    ▼
Select Date/Time/Service
    │
    ▼
Click "Book Now"
    │
    ▼
POST /api/bookings
    │ (with JWT token)
    │
    ▼
Backend: Validate Auth & Data
    │
    ▼
Create Booking Document
    │
    ▼
Save to MongoDB
    │
    ▼
Success Response
    │
    ▼
Frontend: Show Confirmation
    │
    ▼
Update User's Booking History
    │
    ▼
Business Owner sees New Booking
```

## Component Hierarchy

```
App (Root)
│
├── LanguageProvider (Context)
│   └── Language State Management
│
├── ThemeProvider
│   └── Dark/Light Mode
│
├── Header
│   ├── Logo
│   ├── Navigation
│   └── LanguageSwitcher ⭐ (NEW)
│
├── Main Content
│   ├── Home (Landing Page)
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   └── FooterSection
│   │
│   ├── Auth Pages
│   │   ├── Login
│   │   ├── Register (Customer)
│   │   └── Register (Business)
│   │
│   ├── Customer Dashboard
│   │   ├── SearchSection
│   │   │   └── LocationPicker ⭐ (5km search)
│   │   ├── BusinessCard
│   │   ├── BookingHistory
│   │   ├── ReviewsSection
│   │   └── FavoritesSection
│   │
│   └── Business Dashboard
│       ├── ProfileSection
│       ├── BookingHistory
│       ├── CustomerInteractions
│       ├── ReviewsList
│       └── DashboardOverview
│
└── Footer
    ├── Links
    ├── Social
    └── Copyright

⭐ = Phase 3 Additions
```

## Technology Stack

### Frontend
```
┌─────────────────────────────────┐
│      Frontend Stack              │
├─────────────────────────────────┤
│ Runtime:   Node.js 18+          │
│ Framework: Next.js 16.0.10      │
│ UI Library: React 18+           │
│ Language:  TypeScript           │
│ Styling:   Tailwind CSS         │
│ Components: shadcn/ui           │
│ HTTP:      Axios 1.6.0          │
│ Forms:     React Hook Form      │
│ Maps:      React Leaflet        │
│ Icons:     Lucide React         │
│ Toasts:    Sonner               │
│ Package Mgr: npm/pnpm           │
└─────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────┐
│      Backend Stack              │
├─────────────────────────────────┤
│ Runtime:   Node.js 18+          │
│ Framework: Express 4.22.1       │
│ Database:  MongoDB/Mongoose     │
│ Auth:      JWT (jsonwebtoken)   │
│ Security:  bcryptjs, CORS       │
│ Dev Tool:  Nodemon              │
│ Package Mgr: npm                │
│ External:  LibreTranslate API   │
└─────────────────────────────────┘
```

### Database Schema

```
Users Collection
├── _id (ObjectId)
├── name (String)
├── email (String, unique)
├── password (String, hashed)
├── role (String: "customer" | "business")
├── phone (String)
├── profilePic (String, URL)
├── createdAt (Date)
└── updatedAt (Date)

Businesses Collection
├── _id (ObjectId)
├── name (String)
├── owner (ObjectId → User)
├── description (String)
├── category (String)
├── rating (Number)
├── image (String, URL)
├── createdAt (Date)
└── updatedAt (Date)

Businessloc Collection (Locations with GeoJSON)
├── _id (ObjectId)
├── business (ObjectId → Business)
├── address (String)
├── city (String)
├── state (String)
├── pincode (String)
├── location (GeoJSON Point)  ⭐ For 5km search
│   ├── type: "Point"
│   └── coordinates: [longitude, latitude]
├── createdAt (Date)
└── updatedAt (Date)

Bookings Collection
├── _id (ObjectId)
├── customer (ObjectId → User)
├── business (ObjectId → Business)
├── date (Date)
├── time (String)
├── service (String)
├── status (String: "pending" | "confirmed" | "completed")
├── createdAt (Date)
└── updatedAt (Date)

Reviews Collection
├── _id (ObjectId)
├── customer (ObjectId → User)
├── business (ObjectId → Business)
├── rating (Number: 1-5)
├── comment (String)
├── translatedComment (String)  ⭐ Translated version
├── language (String)  ⭐ Original language
├── createdAt (Date)
└── updatedAt (Date)
```

## API Endpoint Map

```
Authentication Routes (/api/auth)
├── POST /register
├── POST /login
└── POST /logout

Business Routes (/api/business)
├── GET / (all businesses)
├── GET /nearby (5km radius search)  ⭐ NEW
├── GET /:id (single business)
├── POST / (create)
├── PUT /:id (update)
└── DELETE /:id (delete)

Booking Routes (/api/bookings)
├── GET / (all bookings)
├── GET /:id (single booking)
├── POST / (create booking)
├── PUT /:id (update status)
└── DELETE /:id (cancel)

Review Routes (/api/reviews)
├── GET / (all reviews)
├── GET /business/:id (reviews for business)
├── POST / (create review)
├── PUT /:id (update review)
└── DELETE /:id (delete review)

Translation Routes (/api/translate) ⭐ NEW
├── POST / (translate single text)
└── POST /batch (translate multiple texts)
```

## Security Architecture

```
┌─────────────────────────────────┐
│     Security Layers             │
├─────────────────────────────────┤
│                                 │
│ 1. CORS                         │
│    - Restrict API access        │
│    - Allow only frontend origin │
│                                 │
│ 2. JWT Authentication           │
│    - Token in request headers   │
│    - Verify on each request     │
│    - Role-based access control  │
│                                 │
│ 3. Password Hashing             │
│    - bcryptjs (salt + hash)     │
│    - 10 rounds                  │
│                                 │
│ 4. Input Validation             │
│    - Sanitize user inputs       │
│    - Type checking              │
│    - Range validation           │
│                                 │
│ 5. Error Handling               │
│    - Generic error messages     │
│    - Prevent info leakage       │
│    - Logging & monitoring       │
│                                 │
└─────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│        Production Environment            │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Frontend (Next.js Static/SSR)    │ │
│  │   - Vercel / Netlify / AWS S3+CF  │ │
│  │   - Auto deploy on git push       │ │
│  │   - CDN for static assets         │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Backend (Node.js + Express)      │ │
│  │   - Heroku / Railway / Render      │ │
│  │   - Docker container               │ │
│  │   - Environment variables secured  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Database (MongoDB)               │ │
│  │   - MongoDB Atlas (cloud)          │ │
│  │   - Automatic backups              │ │
│  │   - Scaling & replication          │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   External APIs                    │ │
│  │   - LibreTranslate (free tier)     │ │
│  │   - Browser Geolocation API        │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

## Performance Optimizations

```
Frontend Optimizations:
├── Image lazy loading
├── Code splitting (dynamic imports)
├── Translation caching (localStorage)
├── Debounced search
└── Responsive design

Backend Optimizations:
├── MongoDB indexing
│   ├── User email unique index
│   ├── Business location GeoJSON index
│   └── Booking date index
├── JWT token caching
├── Distance calculation optimization
└── Error handling with fallbacks

Database Optimizations:
├── GeoJSON 2dsphere index for location search
├── Indexed queries for fast lookups
├── Efficient aggregation pipelines
└── Connection pooling
```

## Error Handling Flow

```
User Action
    │
    ▼
Frontend Component
    │
    ├─ Try: Make API call
    │   │
    │   ▼
    │ Backend Receives Request
    │   │
    │   ├─ Validate Input
    │   │ ├─ Success → Process
    │   │ └─ Error → Return 400
    │   │
    │   ├─ Authenticate
    │   │ ├─ Valid → Continue
    │   │ └─ Invalid → Return 401
    │   │
    │   ├─ Process Data
    │   │ ├─ Success → Return 200 + data
    │   │ └─ Error → Return 500
    │   │
    │   ▼
    │ Frontend Receives Response
    │   │
    │   ├─ 200-299 → Show data
    │   ├─ 400-499 → Show error message
    │   └─ 500+ → Show generic error
    │
    └─ Catch: Display error toast
        └─ Fallback to original content
```

---

**Architecture Last Updated:** Phase 3 Complete
**Status:** Production Ready ✅
