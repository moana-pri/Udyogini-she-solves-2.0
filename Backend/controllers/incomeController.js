import Booking from "../models/Booking.js";

/**
 * Get income statistics for business owner
 * Returns Today's Income, This Month's Income, and Total Income
 * Only counts completed bookings with amountReceived
 */
export async function getIncomeStats(req, res) {
  try {
    console.log("💰 Fetching income stats for business:", req.user.businessId);

    if (!req.user.businessId) {
      return res
        .status(400)
        .json({ message: "Business ID not found for user" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    console.log(`📅 Today: ${today.toISOString()} to ${todayEnd.toISOString()}`);
    console.log(`📅 Month: ${monthStart.toISOString()} to ${monthEnd.toISOString()}`);

    // Get all completed bookings for this business
    const completedBookings = await Booking.find({
      businessId: req.user.businessId,
      status: "completed",
    });

    console.log(`✅ Found ${completedBookings.length} completed bookings`);

    // Calculate Today's Income
    const todayIncome = completedBookings
      .filter((booking) => {
        const bookingCompletedDate = booking.completedAt
          ? new Date(booking.completedAt)
          : new Date(booking.updatedAt);
        return (
          bookingCompletedDate >= today && bookingCompletedDate <= todayEnd
        );
      })
      .reduce((sum, booking) => sum + (booking.amountReceived || 0), 0);

    // Calculate This Month's Income
    const monthIncome = completedBookings
      .filter((booking) => {
        const bookingCompletedDate = booking.completedAt
          ? new Date(booking.completedAt)
          : new Date(booking.updatedAt);
        return (
          bookingCompletedDate >= monthStart &&
          bookingCompletedDate <= monthEnd
        );
      })
      .reduce((sum, booking) => sum + (booking.amountReceived || 0), 0);

    // Calculate Total Income
    const totalIncome = completedBookings.reduce(
      (sum, booking) => sum + (booking.amountReceived || 0),
      0
    );

    console.log(`💵 Today's Income: ₹${todayIncome}`);
    console.log(`💵 This Month's Income: ₹${monthIncome}`);
    console.log(`💵 Total Income: ₹${totalIncome}`);

    res.json({
      todayIncome,
      monthIncome,
      totalIncome,
      completedBookingsCount: completedBookings.length,
      averageIncome:
        completedBookings.length > 0
          ? (totalIncome / completedBookings.length).toFixed(2)
          : 0,
    });
  } catch (error) {
    console.error("❌ Error fetching income stats:", error);
    res.status(500).json({
      message: "Error fetching income stats",
      error: error.message,
    });
  }
}

/**
 * Get weekly income statistics (last 7 days)
 * Returns array of { day, totalIncome } for the last 7 days
 */
export async function getWeeklyIncome(req, res) {
  try {
    console.log("📊 Fetching weekly income for business:", req.user.businessId);

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

    // Fetch all completed bookings in the date range for this business
    const completedBookings = await Booking.find({
      businessId: req.user.businessId,
      status: "completed",
    });

    console.log(`✅ Found ${completedBookings.length} completed bookings`);

    // Group income by date
    const incomeByDate = {};

    // Initialize all 7 days with 0 income
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      incomeByDate[dateStr] = {
        date: dateStr,
        day: dayName,
        totalIncome: 0,
      };
    }

    // Sum income per date
    completedBookings.forEach((booking) => {
      const completedDate = booking.completedAt
        ? new Date(booking.completedAt).toISOString().split("T")[0]
        : booking.updatedAt
        ? new Date(booking.updatedAt).toISOString().split("T")[0]
        : null;

      if (completedDate && incomeByDate[completedDate]) {
        incomeByDate[completedDate].totalIncome += booking.amountReceived || 0;
      }
    });

    // Convert to array and sort by date
    const stats = Object.values(incomeByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    console.log(`✅ Weekly income stats ready:`, stats);

    res.json(stats);
  } catch (error) {
    console.error("❌ Error fetching weekly income:", error);
    res.status(500).json({
      message: "Error fetching weekly income",
      error: error.message,
    });
  }
}

export default { getIncomeStats, getWeeklyIncome };
