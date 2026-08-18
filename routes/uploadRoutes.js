import express from "express";
import upload, { uploadBufferToCloudinary } from "../middleware/upload.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/product-images", protect, admin, upload.array("images", 6), async (req, res, next) => {
  try {
    const results = await Promise.all(
      req.files.map((f) => uploadBufferToCloudinary(f.buffer, "kixora/products"))
    );
    res.json({ urls: results.map((r) => r.secure_url) });
  } catch (err) {
    next(err);
  }
});

router.post("/payment-screenshot", protect, upload.single("paymentScreenshot"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const result = await uploadBufferToCloudinary(req.file.buffer, "kixora/payments");
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
});

export default router;