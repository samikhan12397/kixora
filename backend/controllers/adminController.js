import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

// @route GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenueAgg, totalUsers, totalProducts, pendingOrders, lowStock] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Product.find({ stock: { $lte: 5 } }).select("name stock sku").limit(10),
    ]);

    const salesByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$grandTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      totalUsers,
      totalProducts,
      pendingOrders,
      lowStock,
      salesByDay,
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    res.json(await User.find({ role: "customer" }).select("-password").sort("-createdAt"));
  } catch (err) { next(err); }
};

export const getAllReviews = async (req, res, next) => {
  try {
    res.json(await Review.find().populate("user", "name").populate("product", "name"));
  } catch (err) { next(err); }
};

export const toggleReviewApproval = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    review.isApproved = !review.isApproved;
    await review.save();
    res.json(review);
  } catch (err) { next(err); }
};
