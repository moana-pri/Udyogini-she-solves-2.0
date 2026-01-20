import express from "express";
import auth from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Business from "../models/Business.js";



const router = express.Router();

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


export default router;
