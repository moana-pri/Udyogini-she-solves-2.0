import User from "../models/User.js";
import Business from "../models/Business.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* REGISTER CUSTOMER */
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, phone, password, preferredLanguage } = req.body;

    const exists = await User.findOne({ phone });

    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
  fullName,
  phone,
  password: hashedPassword,
  role: "customer",
  preferredLanguage
});

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* REGISTER BUSINESS OWNER */
export const registerBusiness = async (req, res) => {
  try {
    const {
  fullName,
  phone,
  password,
  businessName,
  businessType,
  location,
  workingHours,
  priceRange,

  businessDescription: {
    text: description,          // text owner typed
    language: preferredLanguage // owner-selected language
  },
} = req.body;

    const exists = await User.findOne({ phone });

    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: "business_owner",
      preferredLanguage
    });

   await Business.create({
  ownerId: user._id,
  businessName,
  businessType,
  location,
  workingHours,
  priceRange,
  businessDescription: {
    text: description,
    language: preferredLanguage,
  },
});


    res.status(201).json({ message: "Business registered, pending approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

const user = await User.findOne({ phone });
if (!user) {
  return res.status(401).json({ message: "Invalid credentials" });
}

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
