# 📖 Command Reference & Troubleshooting

## 🚀 Quick Start Commands

### First Time Setup

```bash
# Clone or navigate to project
cd She_Solves

# Setup Backend
cd Backend
npm install
# Create .env file with MongoDB URI and JWT secret
# See GET_STARTED.md for details

# Setup Frontend (in new terminal)
cd Frontend
npm install
# Create .env.local file with API URL

# Run Backend (Terminal 1)
cd Backend
npm start
# Should show: "Server running on port 5000"

# Run Frontend (Terminal 2)
cd Frontend
npm run dev
# Should show: "Local: http://localhost:3000"
```

### Access the Application

```
Browser: http://localhost:3000
```

---

## 🛠️ Development Commands

### Backend Development

```bash
cd Backend

# Start development server (with auto-reload)
npm start
# Uses nodemon to watch file changes

# Install a new package
npm install package-name

# Remove a package
npm uninstall package-name

# View npm scripts
cat package.json | grep -A 10 '"scripts"'

# Run API tests (if configured)
npm test
```

### Frontend Development

```bash
cd Frontend

# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code (check for errors)
npm run lint

# Install a new package
npm install package-name

# Remove a package
npm uninstall package-name
```

---

## 🔧 Configuration Files

### Backend Configuration

**File: `Backend/.env`**
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/she_solves
# or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/she_solves

# Authentication
JWT_SECRET=your_secret_key_very_secure_string_minimum_32_chars

# Environment
NODE_ENV=development
PORT=5000

# Translation API (optional - defaults to public LibreTranslate)
TRANSLATION_API=https://libretranslate.de
```

**File: `Backend/package.json` (Key Dependencies)**
```json
{
  "dependencies": {
    "express": "^4.22.1",
    "mongoose": "^8.21.0",
    "jsonwebtoken": "^9.1.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Frontend Configuration

**File: `Frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
# Note: NEXT_PUBLIC_ prefix makes it available in browser
```

**File: `Frontend/package.json` (Key Dependencies)**
```json
{
  "dependencies": {
    "next": "^16.0.10",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "axios": "^1.6.0",
    "react-leaflet": "^4.2.3",
    "leaflet": "^1.9.4"
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Won't Start

**Error: `MONGO_URI is not defined`**
```bash
# Solution: Create .env file in Backend directory
cd Backend
# On Windows (PowerShell)
echo "MONGO_URI=mongodb://localhost:27017/she_solves`nJWT_SECRET=test_secret`nNODE_ENV=development`nPORT=5000" > .env

# On Mac/Linux
echo "MONGO_URI=mongodb://localhost:27017/she_solves
JWT_SECRET=test_secret
NODE_ENV=development
PORT=5000" > .env

# Then restart: npm start
```

**Error: `Port 5000 is already in use`**
```bash
# Find and kill process using port 5000
# On Windows (PowerShell)
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# On Mac/Linux
lsof -ti:5000 | xargs kill -9

# Then restart: npm start
```

**Error: `MongoDB connection failed`**
```bash
# Check if MongoDB is running
# If using local MongoDB:
mongod  # Start MongoDB daemon

# If using MongoDB Atlas:
# 1. Check connection string in .env
# 2. Verify IP is whitelisted in MongoDB Atlas
# 3. Check username/password are correct
# 4. Ensure cluster is deployed (not paused)
```

**Error: `Cannot find module 'express'`**
```bash
# Reinstall dependencies
cd Backend
rm -r node_modules
npm install
npm start
```

---

### Issue 2: Frontend Won't Load

**Error: `Cannot GET /` or blank page**
```bash
# Check if frontend is running
# Should see: "▲ Next.js 16.0.10" in terminal

# If not running:
cd Frontend
npm run dev

# If still not working:
cd Frontend
rm -r node_modules
npm install
npm run dev
```

**Error: `API calls failing (TypeError: fetch failed)`**
```bash
# Check Backend is running
# Run in Backend terminal: npm start
# Should show: "Server running on port 5000"

# Verify NEXT_PUBLIC_API_URL in .env.local
# Should be: NEXT_PUBLIC_API_URL=http://localhost:5000

# Clear browser cache and refresh
```

**Error: `Module not found: language-switcher`**
```bash
# Verify file exists:
# Frontend/components/common/language-switcher.tsx

# If missing, reinstall:
cd Frontend
npm install
npm run dev
```

**Error: `TypeScript compilation errors`**
```bash
# Run build to see detailed errors
cd Frontend
npm run build

# Fix errors shown, then:
npm run dev
```

---

### Issue 3: Multilanguage Not Working

**Translation returns English instead of translated text**

```bash
# Test the translation endpoint manually
# Using PowerShell (Windows):
$body = @{
    text = "Hello"
    language = "hi"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/translate" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | Format-List

# Using curl (all platforms):
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","language":"hi"}'

# Should return JSON with translated text
```

**Language switcher not visible**
```bash
# Check if LanguageSwitcher is imported in header
# File: Frontend/components/header.tsx

# Verify import line exists:
# import { LanguageSwitcher } from "@/components/common/language-switcher"

# Verify it's used in JSX:
# <LanguageSwitcher />

# Restart frontend
cd Frontend
npm run dev
```

**Language not persisting on refresh**
```bash
# Check browser's localStorage
# Open Browser DevTools (F12)
# Go to: Application → Storage → Local Storage → http://localhost:3000
# Look for key: "appLanguage"

# If not found, language context may not be working
# Check: Frontend/lib/language-context.tsx

# Restart frontend and try again
```

---

### Issue 4: Location Search Not Working

**Geolocation button does nothing**
```bash
# Browser geolocation requires HTTPS or localhost
# Make sure app is accessed via:
# ✅ http://localhost:3000 (local)
# ❌ http://127.0.0.1:3000 (may not work with geolocation)

# Grant permission in browser:
# 1. Click geolocation button
# 2. Browser will ask permission
# 3. Click "Allow"

# If permission blocked:
# 1. Click lock icon in address bar
# 2. Find location permission
# 3. Change to "Allow"
```

**"Search Nearby" returns no results**
```bash
# Check if database has business locations
# Test endpoint:
curl "http://localhost:5000/api/business/nearby?lat=19.0760&lng=72.8777&radius=5"

# Should return array of businesses with distance field

# If empty:
# 1. Seed database with sample data
# 2. Check business locations have coordinates
# 3. Verify GeoJSON format

# Seed database (run from Backend directory):
node scripts/seedDatabase.js
```

**Search returns all businesses, not just nearby**
```bash
# Verify radius parameter is being passed
# Check URL: GET /api/business/nearby?lat=X&lng=Y&radius=5

# Frontend should send radius=5 by default
# If not, check: Frontend/components/customer/search-section.tsx

# Restart frontend
cd Frontend
npm run dev
```

---

### Issue 5: Booking/Review Errors

**Cannot create booking - "Unauthorized"**
```bash
# Check if logged in
# If not: Go to /login and log in

# Check JWT token in browser
# DevTools → Application → Cookies → Look for auth token
# If missing: Need to login again

# Verify backend receives token:
# Backend will show auth errors in console
cd Backend  # See npm start terminal for errors
```

**Review submission fails**
```bash
# Check if review text is provided
# Review requires: rating (1-5) and comment (optional but recommended)

# Check network error
# Browser DevTools → Network tab → Click submit
# Look for failed request and error message

# If 500 error in backend:
# Check Backend console (npm start terminal)
# Fix error shown and restart Backend
```

---

### Issue 6: Database Issues

**Cannot connect to MongoDB Atlas**
```bash
# Verify connection string format
# Should be: mongodb+srv://username:password@cluster-xyz.mongodb.net/database_name

# Check in MongoDB Atlas:
# 1. Go to Atlas console
# 2. Click "Connect" on cluster
# 3. Choose "Connect your application"
# 4. Copy connection string
# 5. Add database name at end: .../database_name?retryWrites=true

# Common issues:
# - IP not whitelisted (add 0.0.0.0/0 for development)
# - Wrong password (check special characters)
# - User doesn't have database access (create new user)
# - Cluster is paused (resume it)
```

**Database getting huge / Running out of space**
```bash
# Clear test data
# Connect to MongoDB and drop test collections:
mongo "your_connection_string"
# Then in mongo shell:
use she_solves
db.bookings.deleteMany({})
db.reviews.deleteMany({})

# Keep only necessary data
```

---

## 🧪 Testing Commands

### Test Backend API

```bash
# Using curl or PowerShell

# Test 1: Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"password123",
    "role":"customer"
  }'

# Test 2: Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
# Save the token from response

# Test 3: Translation
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","language":"hi"}'

# Test 4: Search Nearby
curl "http://localhost:5000/api/business/nearby?lat=19.0760&lng=72.8777&radius=5"

# Test 5: Get All Businesses
curl http://localhost:5000/api/business
```

### Test Frontend Features

```
1. Open http://localhost:3000

2. Test Language Switcher:
   - Click Globe icon in header
   - Select "हिंदी" (Hindi)
   - Page should translate to Hindi
   - Refresh and verify language persists

3. Test Registration:
   - Click "Register"
   - Choose "Customer" or "Business"
   - Fill form and submit
   - Should redirect to login

4. Test Login:
   - Enter registered email/password
   - Click "Login"
   - Should redirect to dashboard

5. Test Search (Customer):
   - Go to Customer Dashboard
   - Click "Enable Location"
   - Grant permission
   - Click "Search Nearby"
   - Should show businesses within 5km

6. Test Booking:
   - Click on business card
   - Click "Book Now"
   - Select date/time
   - Click "Confirm Booking"
   - Should show confirmation

7. Test Review:
   - After booking, view business
   - Click "Leave Review"
   - Enter rating and comment
   - Click "Submit"
   - Should show confirmation
```

---

## 📊 Debugging with DevTools

### Browser DevTools (F12)

**Console Tab:**
```javascript
// Check for JavaScript errors
// Look for red errors and fix them

// Test API manually:
fetch('http://localhost:5000/api/business')
  .then(r => r.json())
  .then(d => console.log(d))

// Check localStorage:
localStorage.getItem('appLanguage')
// Should return current language
```

**Network Tab:**
```
1. Open Network tab
2. Perform action (login, search, etc.)
3. Look at requests:
   - Check URL is correct
   - Check Status (200=success, 401=auth error, 500=server error)
   - Check Response has data
   - Check Response time (>1s = slow)
```

**Application Tab:**
```
1. Cookies → Check auth token exists
2. Local Storage → Check appLanguage saved
3. Session Storage → Check temporary data
```

### Backend Logging

```javascript
// Backend console shows request logs
// You'll see:
// - GET /api/business (200)
// - POST /api/auth/login (200)
// - Errors with stack traces

// Example in Terminal:
//   GET /api/business 200 - 45.23 ms
//   POST /api/translate 200 - 234.12 ms
//   POST /api/auth/register 500 - Error creating user
```

---

## 🔍 Verification Checklist

Use this to verify everything is working:

```
SETUP
□ Backend .env file created
□ Frontend .env.local file created
□ npm install completed (Backend & Frontend)
□ MongoDB running (local or Atlas connected)

BACKEND
□ npm start runs without errors
□ "Server running on port 5000" shown
□ "MongoDB connected" shown
□ No red errors in terminal

FRONTEND
□ npm run dev runs without errors
□ "▲ Next.js" shown in terminal
□ App loads at localhost:3000
□ No errors in browser console (F12)

FEATURES
□ Language switcher visible in header
□ Can select different languages
□ Page text changes with language
□ Language persists on refresh
□ Can login with registered account
□ Location button works and asks permission
□ Search nearby returns results
□ Can create booking
□ Can submit review

API ENDPOINTS
□ GET /api/business (returns businesses)
□ GET /api/business/nearby (returns nearby)
□ POST /api/translate (returns translation)
□ POST /api/auth/login (returns token)
□ POST /api/bookings (creates booking)
```

---

## 📞 Need Help?

1. **Check this file** - Most issues covered above
2. **Read GET_STARTED.md** - Setup and configuration
3. **Read MULTILANGUAGE_GUIDE.md** - Translation system
4. **Read SEARCH_GUIDE.md** - Location search
5. **Check browser console** (F12) - Frontend errors
6. **Check terminal** (npm start) - Backend errors
7. **Check .env files** - Ensure configured correctly

---

**Last Updated:** Phase 3 Complete
**Version:** 1.0
**Status:** ✅ Ready for Production
