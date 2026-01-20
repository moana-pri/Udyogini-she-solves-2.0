# 🧪 HOW TO TEST THE FIXES

## Quick Test Steps

### Step 1: Register New User
1. Go to `/register/customer`
2. Enter:
   - **Name:** Your name (e.g., "Rajini" or "Meera")
   - **Phone:** 9876543210
   - **Password:** test123
   - **Language:** EN
3. Click Register

**Expected:** Registration successful message

---

### Step 2: Login
1. Go to `/login`
2. Select **Customer** tab
3. Enter:
   - **Phone:** 9876543210
   - **Password:** test123
4. Click "Sign In as Customer"

**Expected:** Redirects to `/customer/dashboard`

---

### Step 3: Check Name Display
1. Look at **top right corner** of header
2. You should see your actual name (not "Anita")
3. Avatar shows first 2 letters of your name

**✅ Expected:** Your name appears everywhere
- Header: "Welcome back, Rajini"
- Top right: Shows "Rajini"
- Avatar: Shows "RA"

---

### Step 4: Test Location Search
1. Click **"Nearby"** button on search section
2. Browser will ask: "Allow location access?"
3. Click **"Allow"**

**✅ Expected:**
- Shows: "Near You (X services found)"
- Each service shows distance in km
- List updated with nearby businesses

---

### Step 5: Test Service Type Filter
1. Select service type: "Beauty Parlour"
2. Click **"Nearby"** again
3. Allow location

**✅ Expected:**
- Only Beauty Parlour services shown
- Still filtered by distance
- Shows count of matching services

---

## What Each Component Should Show

### Header
```
UDYOGINI  Home  Search Services  Bookings  Favorites  Reviews  Profile
                                                    [EN] HI MR  🔔
                                                    [Avatar] Rajini
```

### Dashboard Welcome
```
Welcome back, Rajini

Discover and support women-owned businesses in your community
```

### Search Section
```
Find Services
Search for women-owned businesses near you

[Select service type ▼] [Enter location] [Search] [Nearby]
```

### Results After Nearby
```
Near You (5 services found)

[Business Card 1]
Name: Priya's Beauty Studio
Type: Beauty Parlour
Distance: 1.2 km ← Shows real calculated distance
Rating: ⭐ 4.8 (124 reviews)

[Business Card 2]
... etc
```

---

## Troubleshooting

### ❌ "Still shows Anita"
**Solution:**
1. Clear localStorage: `localStorage.clear()` in browser console
2. Re-register with new phone number
3. Refresh page (Ctrl+F5)

### ❌ "Nearby shows 0 services"
**Solution:**
1. Check if backend is running: `curl http://localhost:5000`
2. Verify .env has `MONGO_URI` and `JWT_SECRET`
3. Check browser console for errors (F12 → Console)
4. Allow location permission when prompted

### ❌ "Location permission denied"
**Solution:**
1. Click settings icon in address bar
2. Find "Udyogini" or "localhost:3000"
3. Change location to "Allow"
4. Refresh and try "Nearby" again

### ❌ "Can't register / Login fails"
**Solution:**
1. Check backend is running
2. Check MongoDB connection in .env
3. Try phone: 9876543211 (different number)
4. Check browser console for error messages

---

## Backend Verification

### Check Backend is Running
```powershell
curl http://localhost:5000
```

Should return:
```
Backend is running 🚀
```

### Test Registration Endpoint
```powershell
curl -X POST http://localhost:5000/api/auth/register/customer `
  -H "Content-Type: application/json" `
  -d '{
    "fullName": "Test Name",
    "phone": "1234567890",
    "password": "test123",
    "preferredLanguage": "en"
  }'
```

Should return: `{ "message": "...", "user": { "id": "...", "fullName": "Test Name" } }`

### Test Nearby Endpoint
```powershell
curl "http://localhost:5000/api/business/nearby?lat=28.6139&lng=77.2090&radius=25"
```

Should return: Array of businesses with `distance` field

---

## Browser DevTools Checklist

Open **F12 → Console** and check:

### 1. localStorage has userName
```javascript
localStorage.getItem("userName")
// Should return: "Your Name"
```

### 2. localStorage has token
```javascript
localStorage.getItem("token")
// Should return: "eyJ..." (long token)
```

### 3. API calls working
```javascript
fetch("http://localhost:5000/api/business/nearby?lat=28.6139&lng=77.2090&radius=25")
  .then(r => r.json())
  .then(console.log)
// Should show array of businesses with distance
```

### 4. No errors in console
- Red error messages = something broke
- Yellow warnings = usually OK
- If errors, fix them before proceeding

---

## Success Indicators ✅

- [ ] Register → Login → Dashboard works
- [ ] User name displays (not "Anita")
- [ ] "Nearby" button works (not showing 0 services)
- [ ] Distances calculated and shown
- [ ] Service type filtering works
- [ ] No red errors in console
- [ ] API returns business data
- [ ] Location permission requested and works

---

## Files to Monitor

### Backend
- `Backend/.env` - Check JWT_SECRET and MONGO_URI
- `Backend/server.js` - Should start without errors
- Database - Check businesses have location.lat/lng

### Frontend
- `Frontend/app/customer/dashboard/page.tsx` - userName loaded
- `Frontend/components/customer/dashboard-header.tsx` - Shows name
- `Frontend/components/customer/search-section.tsx` - Nearby search
- `localStorage` - Has token, userName, role

---

## Quick Restart Guide

If something breaks:

1. **Stop Backend**
   - Press Ctrl+C in backend terminal

2. **Check .env**
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=udyogini_jwt_secret...
   PORT=5000
   ```

3. **Restart Backend**
   ```powershell
   cd Backend
   node server.js
   ```

4. **Frontend**
   ```powershell
   npm run dev
   ```

5. **Clear Cache**
   - Browser: Ctrl+Shift+Del (Clear History)
   - Code: Restart dev server with `npm run dev`

---

## Expected Flow After Fixes

```
User Registration
    ↓
    ✅ User created with ID
    ✅ Name saved to database
    ↓
User Login
    ↓
    ✅ Token returned
    ✅ Name stored in localStorage
    ↓
Dashboard Load
    ↓
    ✅ Read userName from localStorage
    ✅ Display "Welcome back, [Name]"
    ↓
Click Nearby
    ↓
    ✅ Get GPS coordinates
    ✅ Call API with lat/lng
    ✅ Fetch nearby businesses with distance
    ✅ Display results
    ✅ Show distance in km
```

---

## Time Estimates

| Task | Time |
|------|------|
| Register | 30 seconds |
| Login | 20 seconds |
| Check name display | 10 seconds |
| Test nearby (first time) | 1-2 minutes (location permission) |
| Test service filter | 30 seconds |
| **Total** | **3-4 minutes** |

---

Good luck! 🎯 You should see everything working now!
