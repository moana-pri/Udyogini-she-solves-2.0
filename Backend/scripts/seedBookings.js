import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Business from "../models/Business.js";

dotenv.config();

async function seedBookings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all customers and businesses
    const customers = await User.find({ role: "customer" });
    const businesses = await Business.find({});

    if (customers.length === 0 || businesses.length === 0) {
      console.log("No customers or businesses found. Please seed users and businesses first.");
      process.exit(1);
    }

    console.log(`Found ${customers.length} customers and ${businesses.length} businesses`);

    // Sample booking data
    const sampleBookings = [
      {
        service: "Hair Cut",
        date: "2024-01-15",
        time: "10:00 AM",
        price: 300,
        notes: "Regular haircut",
        status: "pending"
      },
      {
        service: "Facial",
        date: "2024-01-16",
        time: "2:00 PM",
        price: 500,
        notes: "Deep cleansing facial",
        status: "confirmed"
      },
      {
        service: "Mehendi",
        date: "2024-01-17",
        time: "11:00 AM",
        price: 1500,
        notes: "Bridal mehendi",
        status: "completed"
      },
      {
        service: "Tailoring",
        date: "2024-01-18",
        time: "3:00 PM",
        price: 800,
        notes: "Suit alteration",
        status: "pending"
      },
      {
        service: "Jewelry Repair",
        date: "2024-01-19",
        time: "1:00 PM",
        price: 200,
        notes: "Chain repair",
        status: "confirmed"
      }
    ];

    let createdCount = 0;

    // Create bookings for each customer with random businesses
    for (const customer of customers.slice(0, 5)) { // Limit to first 5 customers
      for (let i = 0; i < Math.min(3, businesses.length); i++) {
        const business = businesses[i];
        const bookingData = sampleBookings[Math.floor(Math.random() * sampleBookings.length)];

        // Check if booking already exists
        const exists = await Booking.findOne({
          customerId: customer._id,
          businessId: business._id,
          date: bookingData.date
        });

        if (!exists) {
          await Booking.create({
            customerId: customer._id,
            businessId: business._id,
            ...bookingData
          });

          console.log(`✅ Created booking for ${customer.fullName} with ${business.businessName}`);
          createdCount++;
        }
      }
    }

    console.log(`\n✅ Successfully created ${createdCount} sample bookings!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedBookings();
