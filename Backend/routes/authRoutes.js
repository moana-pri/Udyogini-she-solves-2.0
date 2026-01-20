import express from "express";
import {
  registerCustomer,
  registerBusiness,
  login,
} from "../controllers/authController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/business", registerBusiness);
router.post("/login", login);

// Verify token endpoint
router.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      id: decoded.id,
      role: decoded.role,
      fullName: decoded.fullName
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
