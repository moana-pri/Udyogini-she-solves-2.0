import express from "express"
import Business from "../models/Business.js"
import auth from "../middleware/auth.js"
import { getBusinessDashboard } from "../controllers/dashboardController.js";
import { translateText } from "../utils/translate.js";


const router = express.Router()

/**
 * GET BUSINESSES FOR CUSTOMER (WITH TRANSLATION)
 */
router.get("/customer", auth("customer"), async (req, res) => {
  try {
    const customerLanguage = req.user.preferredLanguage || "en";

    const businesses = await Business.find();

    const result = await Promise.all(
      businesses.map(async (b) => {
        let description = b.businessDescription.text;

        if (b.businessDescription.language !== customerLanguage) {
          description = await translateText(
            b.businessDescription.text,
            customerLanguage
          );
        }

        return {
          _id: b._id,
          businessName: b.businessName,
          businessType: b.businessType,
          location: b.location,
          priceRange: b.priceRange,
          phone: b.phone,
          description, // 👈 THIS IS WHAT CUSTOMER SEES
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id/customer", auth("customer"), async (req, res) => {
  try {
    const customerLanguage = req.user.preferredLanguage || "en";
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    let description = business.businessDescription.text;

    if (business.businessDescription.language !== customerLanguage) {
      description = await translateText(
        business.businessDescription.text,
        customerLanguage
      );
    }

    res.json({
      _id: business._id,
      businessName: business.businessName,
      businessType: business.businessType,
      location: business.location,
      workingHours: business.workingHours,
      priceRange: business.priceRange,
      phone: business.phone,
      description, // 👈 translated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



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
  const business = await Business.findOne({ ownerId: req.user.id })
  res.json(business)
})

router.get("/dashboard", auth("business_owner"), getBusinessDashboard);

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" });
    }

    // simple version (no geo index yet)
    const businesses = await Business.find({
      "location.lat": { $ne: null },
      "location.lng": { $ne: null },
    }).limit(20);

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router
