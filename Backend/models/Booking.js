import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: Number,
    notes: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "declined"],
      default: "pending",
    },
    customerPhone: String,
    customerName: String,
    businessName: String,
    businessPhone: String,
    declinedReason: String,
    declinedAt: Date,
    reviewed: {
      type: Boolean,
      default: false,
    },
    amountReceived: {
      type: Number,
      default: 0,
      description: "Amount received from customer when booking is completed"
    },
    completedAt: {
      type: Date,
      description: "Timestamp when booking was marked as completed"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
