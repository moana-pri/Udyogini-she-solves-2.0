// import mongoose from "mongoose";

// const businessSchema = new mongoose.Schema({
//   ownerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   name: String,
//   category: String,
//   description: String,
//   address: String,
//   phone: String,

//   // 🌍 GEO LOCATION
//   location: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       default: "Point"
//     },
//     coordinates: {
//       type: [Number] // [longitude, latitude]
//     }
//   }

// }, { timestamps: true });
// businessSchema.index({ location: "2dsphere" });

// export default mongoose.model("Business", businessSchema);
import mongoose from "mongoose";

const businessLocSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  }
});

// REQUIRED for geo queries
businessLocSchema.index({ location: "2dsphere" });

export default mongoose.model("BusinessLoc", businessLocSchema);
