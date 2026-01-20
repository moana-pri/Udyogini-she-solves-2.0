import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  // email: { type: String, required: true, unique: true },
  phone: {
  type: String,
  required: true,
  unique: true
},

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["customer", "business_owner"],
    required: true
  },

  preferredLanguage: {
    type: String,
    default: "en"
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);
