import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    address: { type: String },
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  workingHours: {
    type: String
  },
  priceRange: {
    type: String
  },
  phone: {
    type: String
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  profileViews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Business", businessSchema);
