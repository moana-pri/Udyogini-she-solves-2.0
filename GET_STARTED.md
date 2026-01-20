# 🚀 She_Solves - Getting Started Guide

Welcome! This guide will help you quickly set up and run the She_Solves platform with all Phase 3 features (Multilanguage Support & Location-Based Search).

## 📋 Quick Overview

**What You Have:**
- ✅ Complete backend with Express & MongoDB
- ✅ Modern frontend with Next.js & React
- ✅ 7-language support (English, Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam)
- ✅ 5km location-based search
- ✅ User authentication & authorization
- ✅ Business bookings & reviews system
- ✅ Language switcher component

## 🎯 Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (Optional, for version control)

## 🛠️ Installation & Setup

### Step 1: Set Up Environment Variables

#### Backend Setup
Navigate to `Backend/` and create `.env` file:

```bash
cd Backend
```

Create `.env` file with:
```env
MONGO_URI=mongodb://localhost:27017/she_solves
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
TRANSLATION_API=https://libretranslate.de
```

> **Note:** Replace `MONGO_URI` with your MongoDB connection string if using Atlas

#### Frontend Setup
Navigate to `Frontend/` and create `.env.local` file:

```bash
cd ../Frontend
```

Create `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd Backend
npm install
```

**Frontend:**
```bash
cd ../Frontend
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd Backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Start Frontend Development Server

In a new terminal:
```bash
cd Frontend
npm run dev
```

You should see:
```
▲ Next.js 16.0.10
- Local: http://localhost:3000
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## ✨ Testing the Features

### 1. Test Multilanguage Support

1. Open the app at `http://localhost:3000`
2. Look for the **Language Switcher** (Globe icon) in the top navigation
3. Click to see available languages:
   - 🇮🇳 English
   - 🇮🇳 हिंदी (Hindi)
   - 🇮🇳 मराठी (Marathi)
   - 🇮🇳 தமிழ் (Tamil)
   - 🇮🇳 తెలుగు (Telugu)
   - 🇮🇳 ಕನ್ನಡ (Kannada)
   - 🇮🇳 മലയാളം (Malayalam)
4. Select a language and refresh the page
5. Content should be translated automatically

### 2. Test Location-Based Search

1. Register as a **Customer** on the app
2. Go to **Search/Dashboard** section
3. Click **"Enable Location"** button
4. Grant browser permission to access your location
5. Click **"Search Nearby"** button
6. See businesses within 5km radius sorted by distance

### 3. Test Bookings & Reviews

1. As a **Customer**:
   - Search and find a business
   - Click business card
   - Make a booking
   - Leave a review

2. As a **Business Owner**:
   - View customer interactions
   - See booking requests
   - Manage reviews

All content supports translation!

## 📁 Project Structure

```
She_Solves/
├── Backend/
│   ├── server.js                    # Main server entry point
│   ├── package.json
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── businessRoutes.js        # Business & search endpoints
│   │   ├── bookingRoutes.js         # Booking management
│   │   ├── reviewRoutes.js          # Reviews system
│   │   └── translationRoutes.js    # NEW: Translation API
│   ├── controllers/                 # Business logic
│   ├── models/                      # Database schemas
│   └── middleware/                  # Authentication middleware
│
├── Frontend/
│   ├── next.config.mjs
│   ├── package.json
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── layout.tsx               # Root layout
│   │   ├── business/                # Business owner pages
│   │   ├── customer/                # Customer pages
│   │   ├── login/                   # Login page
│   │   └── register/                # Registration pages
│   ├── components/
│   │   ├── header.tsx               # Header with language switcher
│   │   ├── common/
│   │   │   └── language-switcher.tsx # NEW: Language selector
│   │   ├── business/                # Business components
│   │   ├── customer/                # Customer components
│   │   └── ui/                      # Reusable UI components
│   ├── hooks/
│   │   ├── use-translation.ts       # NEW: Translation hook
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── translate-api.ts         # NEW: Translation API client
│   │   ├── language-context.tsx     # NEW: Language state management
│   │   └── translations.ts          # Translation strings
│   └── public/                      # Static files
│
├── Documentation/                   # Comprehensive guides
│   ├── MULTILANGUAGE_GUIDE.md      # Translation system docs
│   ├── SEARCH_GUIDE.md             # Location search docs
│   ├── API_REFERENCE.md            # API endpoints
│   ├── FINAL_CHECKLIST.md          # Verification checklist
│   └── [10+ more guides]
│
└── README.md                        # Project overview
```

## 🔧 Key Configuration Files

### Backend Configuration
- `Backend/.env` - Environment variables
- `Backend/server.js` - Server setup (port 5000)
- `Backend/routes/translationRoutes.js` - Translation API

### Frontend Configuration
- `Frontend/.env.local` - Environment variables
- `Frontend/next.config.mjs` - Next.js config
- `Frontend/components/common/language-switcher.tsx` - Language UI
- `Frontend/lib/language-context.tsx` - Language state

## 📡 API Endpoints

### Translation API (NEW)
```bash
# Single text translation
POST /api/translate
Body: { "text": "Hello", "language": "hi" }

# Batch translation
POST /api/translate/batch
Body: { "texts": ["Hello", "World"], "language": "hi" }
```

### Search API
```bash
# Search nearby businesses (5km radius)
GET /api/business/nearby?lat=19.0760&lng=72.8777&radius=5
```

### Other Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: MONGO_URI not found
→ Check .env file is in Backend/ directory
→ Verify MongoDB is running locally or check Atlas connection

Error: Port 5000 already in use
→ Kill process: lsof -ti:5000 | xargs kill
→ Or change PORT in .env
```

### Frontend Won't Load
```
Error: Cannot connect to API
→ Check Backend is running on port 5000
→ Verify NEXT_PUBLIC_API_URL in .env.local

Error: Missing language-switcher component
→ Ensure Frontend/components/common/language-switcher.tsx exists
→ Run: npm install (in Frontend directory)
```

### Multilanguage Not Working
```
Check Translation API:
→ Test: curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","language":"hi"}'

Should return Hindi translation
```

### Location Search Not Working
```
Check Geolocation:
→ Use HTTPS (or localhost) for browser geolocation
→ Grant location permission in browser
→ Check database has business locations with coordinates

Check Nearby Endpoint:
→ Test: curl "http://localhost:5000/api/business/nearby?lat=19.0760&lng=72.8777&radius=5"
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Project overview |
| [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) | Quick setup |
| [MULTILANGUAGE_GUIDE.md](MULTILANGUAGE_GUIDE.md) | Translation system |
| [SEARCH_GUIDE.md](SEARCH_GUIDE.md) | Location search |
| [API_REFERENCE.md](API_REFERENCE.md) | All API endpoints |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing procedures |
| [FINAL_CHECKLIST.md](FINAL_CHECKLIST.md) | Verification checklist |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | All docs index |

## 🚀 Next Steps

1. **Run the application** using the commands above
2. **Test all features** using the FINAL_CHECKLIST.md
3. **Read the guides** for deeper understanding
4. **Customize** according to your needs
5. **Deploy** to production (see README.md for options)

## 💡 Pro Tips

### Development
- Use **VS Code** with extensions: ES7+, Thunder Client, MongoDB for VS Code
- Enable **Hot Reload**: Frontend auto-refreshes, Backend via nodemon
- Check **Console Errors**: Frontend (browser console), Backend (terminal)

### Testing
- Use **Thunder Client** or **Postman** to test APIs
- Test with **different languages** to verify translation
- Use **real location** or mock coordinates for search

### Performance
- Translation results are cached on frontend
- Location searches are optimized with MongoDB indexes
- Images are lazy-loaded

## ⚡ Commands Reference

```bash
# Backend
cd Backend
npm install          # Install dependencies
npm start           # Start server
npm run test        # Run tests (if configured)

# Frontend
cd ../Frontend
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm start          # Run production build
npm run lint       # Check code quality

# Database
# MongoDB (if running locally)
mongod              # Start MongoDB daemon
# Or use MongoDB Atlas (cloud)
```

## 📞 Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Review the specific **documentation file** (MULTILANGUAGE_GUIDE.md, SEARCH_GUIDE.md, etc.)
3. Check **console errors** and **API responses**
4. Verify **.env** files are correctly configured

## ✅ Verification Checklist

Before declaring setup complete, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Language switcher visible in header
- [ ] Can change language (English → Hindi)
- [ ] Search nearby button works
- [ ] Location permission popup appears
- [ ] Can create booking
- [ ] Can submit review
- [ ] Content translates in selected language

## 🎉 You're Ready!

Your She_Solves platform is now ready with:
✅ Multilanguage support (7 languages)
✅ Location-based search (5km radius)
✅ Complete booking & review system
✅ Business owner & customer dashboards
✅ Production-ready architecture

**Enjoy building! 🚀**

---

**Last Updated:** Phase 3 Complete
**Status:** Production Ready ✅
