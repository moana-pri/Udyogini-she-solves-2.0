import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* CREATE BOOKING */
router.post("/", auth("customer"), async (req, res) => {
  try {
    console.log("📝 Creating booking, req.body:", req.body);
    console.log("👤 User:", req.user);

    const { businessId, service, date, time, price, notes } = req.body;

    // Validate required fields
    if (!businessId) {
      console.log("❌ businessId is missing");
      return res.status(400).json({ message: "businessId is required" });
    }
    if (!service) {
      console.log("❌ service is missing");
      return res.status(400).json({ message: "service is required" });
    }
    if (!date) {
      console.log("❌ date is missing");
      return res.status(400).json({ message: "date is required" });
    }
    if (!time) {
      console.log("❌ time is missing");
      return res.status(400).json({ message: "time is required" });
    }

    // Get customer and business info
    const User = (await import("../models/User.js")).default;
    const Business = (await import("../models/Business.js")).default;
    
    const customer = await User.findById(req.user.id);
    const business = await Business.findById(businessId).populate("ownerId");
    
    if (!business) {
      console.log("❌ Business not found:", businessId);
      return res.status(404).json({ message: "Business not found" });
    }

    console.log("✅ Business found:", business.businessName);

    const booking = await Booking.create({
      customerId: req.user.id,
      businessId,
      service,
      date,
      time,
      price: price || 0,
      notes: notes || "",
      status: "pending",
      customerPhone: customer?.phone,
      customerName: customer?.fullName,
      businessName: business.businessName,
      businessPhone: business.phone,
    });

    console.log("✅ Booking created:", booking._id);
    res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* GET CUSTOMER BOOKINGS */
router.get("/customer", auth("customer"), async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("businessId", "businessName location phone ownerName")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET BUSINESS BOOKINGS */
router.get("/business", auth("business_owner"), async (req, res) => {
  try {
    console.log("👤 Business bookings request, user:", req.user);

    if (!req.user.businessId) {
      console.log("❌ No businessId attached to user");
      return res.status(400).json({ message: "Business ID not found for user" });
    }

    const bookings = await Booking.find({ businessId: req.user.businessId })
      .populate("customerId", "fullName phone email")
      .sort({ createdAt: -1 });

    console.log("✅ Found bookings:", bookings.length);
    res.json(bookings);
  } catch (err) {
    console.error("❌ Business bookings error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE BOOKING STATUS - ACCEPT */
router.put("/:id/accept", auth("business_owner"), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    ).populate("customerId", "fullName phone email");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE BOOKING STATUS - DECLINE */
router.put("/:id/decline", auth("business_owner"), async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status: "declined",
        declinedReason: reason || "No reason provided"
      },
      { new: true }
    ).populate("customerId", "fullName phone email");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE BOOKING STATUS - COMPLETE */
router.put("/:id/complete", auth("business_owner"), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE BOOKING STATUS - CANCEL */
router.put("/:id/cancel", auth("customer"), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PATCH - Generic Status Update */
router.patch("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
