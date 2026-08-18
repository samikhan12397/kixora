import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import sendEmail from "../utils/sendEmail.js";
import { orderConfirmationEmail, paymentPendingEmail, paymentVerifiedEmail } from "../utils/emailTemplates.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, paymentScreenshot } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0],
      size: i.size,
      color: i.color,
      price: i.product.finalPrice ?? i.product.price,
      quantity: i.quantity,
    }));
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.usedCount < coupon.maxUses && itemsTotal >= coupon.minOrderAmount) {
        discount = coupon.type === "percent" ? (itemsTotal * coupon.value) / 100 : coupon.value;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
    const shippingFee = itemsTotal > 75 ? 0 : 6.99;
    const grandTotal = +(itemsTotal - discount + shippingFee).toFixed(2);
    const paymentStatus = paymentScreenshot ? "pending_review" : "pending";

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentScreenshot,
      paymentStatus,
      itemsTotal,
      shippingFee,
      discount,
      grandTotal,
      couponCode,
      statusHistory: [{ status: "pending", note: "Order placed" }],
    });
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    cart.items = [];
    await cart.save();

    if (paymentStatus === "pending_review") {
      await sendEmail({ to: req.user.email, subject: "Payment Under Review — KIXORA", html: paymentPendingEmail(order) });
    } else {
      await sendEmail({ to: req.user.email, subject: "Order Confirmed — KIXORA", html: orderConfirmationEmail(order) });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort("-createdAt"));
  } catch (err) { next(err); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (err) { next(err); }
};

export const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).select("status trackingNumber shippingCarrier statusHistory");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { next(err); }
};

// ----- Admin -----
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    res.json(await Order.find(filter).populate("user", "name email").sort("-createdAt"));
  } catch (err) { next(err); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber, shippingCarrier } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (status) {
      order.status = status;
      order.statusHistory.push({ status, note });
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (shippingCarrier) order.shippingCarrier = shippingCarrier;
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.status = "processing";
    order.statusHistory.push({ status: "processing", note: "Payment verified by admin" });
    await order.save();

    await sendEmail({
      to: order.user.email,
      subject: "Payment Verified — KIXORA",
      html: paymentVerifiedEmail(order),
    });

    res.json(order);
  } catch (err) { next(err); }
};