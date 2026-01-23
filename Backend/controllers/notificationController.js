import Booking from "../models/Booking.js";
import Business from "../models/Business.js";

/**
 * Get count of upcoming appointments (accepted bookings with pending/confirmed status)
 * Only counts bookings for today and future dates
 */
export async function getNotificationsCount(req, res) {
  try {
    console.log("🔔 Fetching notifications for business:", req.user.businessId);

    if (!req.user.businessId) {
      return res
        .status(400)
        .json({ message: "Business ID not found for user" });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find bookings that are:
    // 1. For this business
    // 2. Have status "pending" or "confirmed"
    // 3. Have booking date today or in the future
    const upcomingBookings = await Booking.find({
      businessId: req.user.businessId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: today.toISOString().split("T")[0] }, // Compare as date string YYYY-MM-DD
    });

    const count = upcomingBookings.length;

    console.log(`✅ Found ${count} upcoming bookings`);

    res.json({
      count,
      message: count === 1 ? "1 upcoming appointment" : `${count} upcoming appointments`,
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
}

/**
 * Get weekly booking statistics (last 7 days)
 * Returns array of { day, totalBookings } for the last 7 days
 */
export async function getWeeklyStats(req, res) {
  try {
    console.log("📊 Fetching weekly stats for business:", req.user.businessId);

    if (!req.user.businessId) {
      return res
        .status(400)
        .json({ message: "Business ID not found for user" });
    }

    // Get date range: last 7 days
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // 7 days including today
    startDate.setHours(0, 0, 0, 0);

    console.log(`📅 Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Fetch all bookings in the date range for this business
    const bookings = await Booking.find({
      businessId: req.user.businessId,
      date: {
        $gte: startDate.toISOString().split("T")[0],
        $lte: endDate.toISOString().split("T")[0],
      },
    });

    console.log(`📊 Found ${bookings.length} bookings in range`);

    // Group bookings by date
    const bookingsByDate = {};

    // Initialize all 7 days with 0 bookings
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      bookingsByDate[dateStr] = {
        date: dateStr,
        day: dayName,
        totalBookings: 0,
      };
    }

    // Count bookings per date
    bookings.forEach((booking) => {
      const dateStr = booking.date;
      if (bookingsByDate[dateStr]) {
        bookingsByDate[dateStr].totalBookings += 1;
      }
    });

    // Convert to array and sort by date
    const stats = Object.values(bookingsByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    console.log(`✅ Weekly stats ready:`, stats);

    res.json(stats);
  } catch (error) {
    console.error("❌ Error fetching weekly stats:", error);
    res.status(500).json({
      message: "Error fetching weekly stats",
      error: error.message,
    });
  }
}

export default { getNotificationsCount, getWeeklyStats };
