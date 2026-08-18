import express from "express";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Admin uploads product images — returns Cloudinary URLs to save on the Product doc
router.post("/product-images", protect, admin, upload.array("images", 6), (req, res) => {
  const urls = req.files.map((f) => f.path);
  res.json({ urls });
});

// Customer uploads a payment screenshot for manual payment methods (NayaPay/Bank Transfer)
router.post("/payment-screenshot", protect, upload.single("paymentScreenshot"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: req.file.path });
});

export default router;
