import express from "express";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* CUSTOMER BOOKINGS */
router.get("/customer", auth("customer"), async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("businessId", "businessName location phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* BUSINESS BOOKINGS */
router.get("/business", auth("business_owner"), async (req, res) => {
  const bookings = await Booking.find({ businessId: req.user.businessId })
    .populate("customerId", "fullName phone")
    .sort({ createdAt: -1 });

  res.json(bookings);
});

export default router;
