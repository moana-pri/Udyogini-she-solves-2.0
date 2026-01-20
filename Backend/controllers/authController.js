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

    const user = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: "customer",
      preferredLanguage
    });

    res.status(201).json({ 
      message: "Customer registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      }
    });
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
      latitude,
      longitude,
      workingHours,
      priceRange,
      description,
      preferredLanguage
    } = req.body;

    console.log("📝 Registering business:", { fullName, businessName, phone });

    const exists = await User.findOne({ phone });

    if (exists) {
      console.log("❌ User already exists:", phone);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName, // Owner's personal name
      phone,
      password: hashedPassword,
      role: "business_owner",
      preferredLanguage
    });

    console.log("✅ User created:", user._id, "Name:", fullName);

    const business = await Business.create({
      ownerId: user._id,
      businessName, // Business/shop name - should be different from owner's name
      businessType,
      location: {
        address: location,
        type: 'Point',
        coordinates: longitude && latitude ? [longitude, latitude] : null, // [lng, lat]
      },
      workingHours,
      priceRange,
      description,
      phone
    });

    console.log("✅ Business created:", business._id, "Business Name:", businessName);

    console.log("✅ Business created:", business._id);

    res.status(201).json({ 
      message: "Business registered, pending approval",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      },
      business: {
        id: business._id,
        businessName: business.businessName
      }
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ message: err.message, error: err.toString() });
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
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET PROFILE */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
