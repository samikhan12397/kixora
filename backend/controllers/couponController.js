import Coupon from "../models/Coupon.js";

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount = 0 } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount is $${coupon.minOrderAmount}` });
    }
    res.json({ valid: true, coupon });
  } catch (err) { next(err); }
};

// ----- Admin -----
export const getCoupons = async (req, res, next) => {
  try { res.json(await Coupon.find().sort("-createdAt")); } catch (err) { next(err); }
};

export const createCoupon = async (req, res, next) => {
  try { res.status(201).json(await Coupon.create(req.body)); } catch (err) { next(err); }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (err) { next(err); }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) { next(err); }
};
