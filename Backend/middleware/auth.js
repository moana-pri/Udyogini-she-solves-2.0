import jwt from "jsonwebtoken";
import Business from "../models/Business.js";

const auth = (role = null) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Decoded token:", { id: decoded.id, role: decoded.role });
      console.log("🎯 Required role:", role);

      if (role && decoded.role !== role) {
        console.log(`❌ Role mismatch: expected ${role}, got ${decoded.role}`);
        return res.status(403).json({ message: `Access denied. Required role: ${role}, user role: ${decoded.role}` });
      }

      // For business owners, fetch and attach businessId
      if (decoded.role === "business_owner") {
        console.log("🏢 Looking for business for ownerId:", decoded.id);
        const business = await Business.findOne({ ownerId: decoded.id });
        if (!business) {
          console.log("❌ Business not found for ownerId:", decoded.id);
          return res.status(404).json({ message: "Business not found" });
        }
        console.log("✅ Business found:", business._id);
        req.user = { ...decoded, businessId: business._id };
      } else {
        req.user = decoded;
      }

      console.log("✅ Auth successful for user:", req.user);
      next();
    } catch (err) {
      console.error("❌ Auth error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default auth;