import express from "express";
import auth from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Business from "../models/Business.js";
import auth from "../middleware/auth.js";
import { translateText } from "../utils/translate.js";


const router = express.Router();

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  businessName: String,
  businessType: String,
  location: String,
  workingHours: String,
  priceRange: String,

  businessDescription: {
    text: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
    },
  },
});

/**
 * CUSTOMER: GET BUSINESSES IN CUSTOMER LANGUAGE
 */
router.get("/customer", auth("customer"), async (req, res) => {
  try {
    const customer = await User.findById(req.user.id);
    const customerLang = customer.preferredLanguage;

    const businesses = await Business.find();

    const result = await Promise.all(
      businesses.map(async (b) => {
        let description = b.businessDescription.text;

        if (b.businessDescription.language !== customerLang) {
          description = await translateText(
            b.businessDescription.text,
            b.businessDescription.language,
            customerLang
          );
        }

        return {
          _id: b._id,
          businessName: b.businessName,
          businessType: b.businessType,
          location: b.location,
          priceRange: b.priceRange,
          rating: b.rating || 0,
          phone: b.phone,
          businessDescription: description,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
