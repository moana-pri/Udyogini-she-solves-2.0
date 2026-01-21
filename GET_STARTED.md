# Udyogini / SheSolves – Setup & Run Guide

## Project Structure

Frontend and Backend run separately.

Frontend: Next.js  
Backend: Node.js + Express + MongoDB

---

## Backend Setup

1. Go to backend folder
2. Create `.env` file

.env content:
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret  
PORT=5000  

3. Install dependencies:
npm install

4. Start backend:
npm run dev

Expected output:
MongoDB connected  
Server running on port 5000

---

## Frontend Setup

1. Go to frontend root folder
2. Create `.env.local` file

.env.local content:
NEXT_PUBLIC_API_URL=http://localhost:5000

3. Install dependencies:
npm install

4. Start frontend:
npm run dev

---

## Common Issues

If login/register hits `undefined/api/...`:
- .env.local is missing or in wrong folder
- Restart frontend after env change

Backend will never show frontend env variables. This is normal.
