import express from "express";
import { getDashboardStats, getCustomers, getAllReviews, toggleReviewApproval } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, admin);
router.get("/dashboard", getDashboardStats);
router.get("/customers", getCustomers);
router.get("/reviews", getAllReviews);
router.put("/reviews/:id/toggle", toggleReviewApproval);
export default router;
