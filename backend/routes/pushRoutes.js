import express from "express";
import { getPublicKey, subscribe, unsubscribe, broadcast } from "../controllers/pushController.js";
import { protect, admin, optionalProtect } from "../middleware/auth.js";

const router = express.Router();

router.get("/vapid-public-key", getPublicKey);
router.post("/subscribe", optionalProtect, subscribe);
router.post("/unsubscribe", unsubscribe);
router.post("/broadcast", protect, admin, broadcast);

export default router;
