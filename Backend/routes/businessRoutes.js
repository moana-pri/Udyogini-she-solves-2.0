import express from "express"
import Business from "../models/Business.js"
import auth from "../middleware/auth.js"
import { getBusinessDashboard } from "../controllers/dashboardController.js";

const router = express.Router()

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
