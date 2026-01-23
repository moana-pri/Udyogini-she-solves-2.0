import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import businessRoutes from "./routes/businessRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js";
import translationRoutes from "./routes/translationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/translate", translationRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/business", businessRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  if (!res.headersSent) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message || "Unknown error",
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
