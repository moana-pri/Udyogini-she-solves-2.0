import express from "express"
import mongoose from "mongoose"
import Business from "../models/Business.js"
import Booking from "../models/Booking.js"
import auth from "../middleware/auth.js"
import { getBusinessDashboard } from "../controllers/dashboardController.js";
import { getBusinessForCustomer, getBusinessesForCustomer } from "../controllers/customerBusinessController.js";
import { getNotificationsCount, getWeeklyStats } from "../controllers/notificationController.js";
import { getIncomeStats, getWeeklyIncome } from "../controllers/incomeController.js";

const router = express.Router()

// Haversine distance formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// UPDATE BUSINESS PROFILE  👇 THIS IS WHERE IT GOES
router.put("/profile", auth("business_owner"), async (req, res) => {
  try {
    const updated = await Business.findOneAndUpdate(
      { ownerId: req.user.id },
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET BUSINESS PROFILE
router.get("/profile", auth("business_owner"), async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user.id })
    if (!business) {
      return res.status(404).json({ message: "Business not found" })
    }
    res.json(business)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/dashboard", auth("business_owner"), getBusinessDashboard);

// 🔔 NOTIFICATION ROUTES
// Get count of upcoming appointments
router.get("/notifications", auth("business_owner"), getNotificationsCount);

// Get weekly booking statistics
router.get("/weekly-stats", auth("business_owner"), getWeeklyStats);

// 💰 INCOME ROUTES
// Get income statistics (today, month, total)
router.get("/income-stats", auth("business_owner"), getIncomeStats);

// Get weekly income statistics
router.get("/weekly-income", auth("business_owner"), getWeeklyIncome);

// GET BUSINESS STATS
router.get("/stats", auth("business_owner"), async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user.id });
    if (!business) return res.status(404).json({ message: "Business not found" });

    const bookings = await Booking.find({ businessId: business._id });

    const totalBookings = bookings.length;
    const completed = bookings.filter(b => b.status === "completed").length;

    res.json({
      totalBookings,
      completedBookings: completed,
      pendingBookings: totalBookings - completed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 10, type } = req.query; // Default to 10km instead of 50km

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location (lat, lng) required" });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = Math.min(parseFloat(radius) || 10, 50); // Max 50km, default 10km

    console.log(`🔍 Searching nearby businesses: lat=${userLat}, lng=${userLng}, radius=${searchRadius}km`);

    // Fetch all businesses with location
    let query = {
      "location.coordinates": { $ne: null },
    };

    // Filter by business type if provided
    if (type) {
      query.businessType = type;
    }

    const businesses = await Business.find(query);
    console.log(`📊 Found ${businesses.length} businesses with locations`);

    // Calculate distance for each business and filter by radius
    const nearbyBusinesses = businesses
      .map(business => ({
        ...business.toObject(),
        distance: calculateDistance(
          userLat,
          userLng,
          business.location.coordinates[1], // lat
          business.location.coordinates[0]  // lng
        )
      }))
      .filter(business => business.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20); // Limit to 20 results

    console.log(`✅ Found ${nearbyBusinesses.length} nearby businesses within ${searchRadius}km`);
    res.json(nearbyBusinesses);
  } catch (err) {
    console.error("❌ Nearby search error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE BUSINESS BY ID (for business owners - no translation)
router.get("/:id", async (req, res) => {
  try {
    console.log("🔍 Fetching business by ID:", req.params.id);

    // Validate ObjectId
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("❌ Invalid ObjectId:", req.params.id);
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(req.params.id);
    if (!business) {
      console.log("❌ Business not found for ID:", req.params.id);
      return res.status(404).json({ message: "Business not found" });
    }
    console.log("✅ Business found:", business.businessName);
    res.json(business);
  } catch (err) {
    console.error("❌ Error fetching business:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid business ID format" });
    }
    res.status(500).json({ message: err.message });
  }
});

// 🌐 CUSTOMER ENDPOINTS (with translation)
// GET SINGLE BUSINESS FOR CUSTOMER (with translation)
router.get("/customer/:businessId", auth("customer"), getBusinessForCustomer);

// GET MULTIPLE BUSINESSES FOR CUSTOMER (with translation)
router.get("/customer/search", auth("customer"), getBusinessesForCustomer);

// SEARCH BUSINESSES BY LOCATION NAME (e.g., "Sukhsagar", "Koramangala")
router.get("/search/location/:locationName", async (req, res) => {
  try {
    const locationName = req.params.locationName;
    const type = req.query.type;

    let query = {
      "location.address": { $regex: locationName, $options: "i" }
    };

    if (type) {
      query.businessType = type;
    }

    const businesses = await Business.find(query).limit(20);
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router
