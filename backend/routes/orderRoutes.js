import express from "express";
import {
  createOrder, getMyOrders, getOrderById, trackOrder,
  getAllOrders, updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.get("/:id/track", trackOrder);
router.get("/:id", protect, getOrderById);

export default router;
