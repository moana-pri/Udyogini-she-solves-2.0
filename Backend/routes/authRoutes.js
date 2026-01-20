import express from "express";
import {
  registerCustomer,
  registerBusiness,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/business", registerBusiness);
router.post("/login", login);

export default router;
