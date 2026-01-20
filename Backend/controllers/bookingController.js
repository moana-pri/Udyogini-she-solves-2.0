import Booking from "../models/Booking.js";

/* CUSTOMER → CREATE BOOKING */
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      customerId: req.user.id,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* BUSINESS → VIEW BOOKINGS */
export const getBusinessBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("customerId", "fullName phone")
    .sort({ createdAt: -1 });

  res.json(bookings);
};

/* CUSTOMER → VIEW BOOKINGS */
export const getCustomerBookings = async (req, res) => {
  const bookings = await Booking.find({ customerId: req.user.id });
  res.json(bookings);
};
