import express from "express";
import {
  createOrder, getMyOrders, getOrderById, trackOrder,
  getAllOrders, updateOrderStatus, verifyPayment,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/verify-payment", protect, admin, verifyPayment);
router.get("/:id/track", trackOrder);
router.get("/:id", protect, getOrderById);

export default router;
