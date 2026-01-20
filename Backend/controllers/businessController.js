import Business from "../models/Business.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

export const getDashboardStats = async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user.id });

    const totalBookings = await Booking.countDocuments({
      businessId: business._id
    });

    const totalCustomers = await Booking.distinct("customerId", {
      businessId: business._id
    });

    const reviews = await Review.find({ businessId: business._id });

    const avgRating =
      reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1);

    res.json({
      totalBookings,
      totalCustomers: totalCustomers.length,
      averageRating: avgRating.toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
