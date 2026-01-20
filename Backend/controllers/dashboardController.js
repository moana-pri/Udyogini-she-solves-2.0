import Booking from "../models/Booking.js";
import Business from "../models/Business.js";

export const getBusinessDashboard = async (req, res) => {
  const business = await Business.findOne({ ownerId: req.user.id });

  const bookings = await Booking.find({ businessId: business._id });

  const totalBookings = bookings.length;

  const bookingsThisMonth = bookings.filter(b => {
    const d = new Date(b.createdAt);
    return d.getMonth() === new Date().getMonth();
  }).length;

  res.json({
    totalCustomers: new Set(bookings.map(b => b.customerId.toString())).size,
    bookingsThisMonth,
    totalBookings,
    profileViews: business.profileViews || 0,
    averageRating: business.averageRating || 0,
    recentBookings: bookings.slice(0, 3),
  });
};
