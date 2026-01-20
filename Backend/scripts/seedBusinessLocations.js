import mongoose from "mongoose";
import dotenv from "dotenv";
import Business from "../models/Business.js";
import BusinessLoc from "../models/BusinessLoc.js";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

const seedLocations = async () => {
  const businesses = await Business.find().limit(10);

  if (businesses.length === 0) {
    console.log("No businesses found. Create businesses first.");
    process.exit();
  }

  await BusinessLoc.deleteMany();

  for (let i = 0; i < businesses.length; i++) {
    const baseLat = 18.5204; // Pune
    const baseLng = 73.8567;

    await BusinessLoc.create({
      businessId: businesses[i]._id,
      location: {
        type: "Point",
        coordinates: [
          baseLng + Math.random() * 0.02,
          baseLat + Math.random() * 0.02
        ]
      }
    });
  }

  console.log("Sample business locations inserted");
  process.exit();
};

connectDB().then(seedLocations);
