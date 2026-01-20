import express from "express";
import Review from "../models/Review.js";
import Business from "../models/Business.js";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* CUSTOMER → ADD REVIEW */
router.post("/", auth("customer"), async (req, res) => {
  try {
    const { businessId, bookingId, rating, comment } = req.body;

    if (!businessId || !rating) {
      return res.status(400).json({ message: "businessId and rating are required" });
    }

    // If bookingId is provided, verify the booking is completed
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (booking.status !== "completed") {
        return res.status(400).json({ message: "Can only review completed bookings" });
      }
      if (booking.customerId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "You can only review your own bookings" });
      }
    }

    const review = await Review.create({
      customerId: req.user.id,
      businessId,
      bookingId: bookingId || null,
      rating,
      comment: comment || "",
    });

    // Mark booking as reviewed
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { reviewed: true });
    }

    // Update business average rating
    const reviews = await Review.find({ businessId });
    const avgRating = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

    await Business.findByIdAndUpdate(businessId, {
      averageRating: avgRating,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL REVIEWS FOR A BUSINESS */
router.get("/business/:businessId", async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviews = await Review.find({ businessId })
      .populate("customerId", "fullName phone")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* BUSINESS OWNER → GET THEIR BUSINESS REVIEWS */
router.get("/owner/reviews", auth("business_owner"), async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user.id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const reviews = await Review.find({ businessId: business._id })
      .populate("customerId", "fullName phone")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CUSTOMER → GET THEIR REVIEWS */
router.get("/customer/reviews", auth("customer"), async (req, res) => {
  try {
    const reviews = await Review.find({ customerId: req.user.id })
      .populate("businessId", "businessName businessType location")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
