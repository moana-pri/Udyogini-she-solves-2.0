import express from "express";
import Review from "../models/Review.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* CUSTOMER → ADD REVIEW */
router.post("/", auth("customer"), async (req, res) => {
  try {
    const { businessId, rating, comment } = req.body;

    const review = await Review.create({
      customerId: req.user.id,
      businessId,
      rating,
      comment,
    });

    const reviews = await Review.find({ businessId });
const avg =
  reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

await Business.findByIdAndUpdate(businessId, {
  averageRating: avg,
  totalReviews: reviews.length,
});


    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* BUSINESS → GET REVIEWS */
router.get("/business", auth("business_owner"), async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.user.businessId })
      .populate("customerId", "fullName");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
