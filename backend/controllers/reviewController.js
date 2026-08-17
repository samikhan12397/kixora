import Review from "../models/Review.js";
import Product from "../models/Product.js";

const recalcRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, { ratingAverage: avg.toFixed(1), ratingCount: count });
};

export const getProductReviews = async (req, res, next) => {
  try {
    res.json(await Review.find({ product: req.params.productId, isApproved: true }).populate("user", "name avatar"));
  } catch (err) { next(err); }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, images } = req.body;
    const review = await Review.create({ product: productId, user: req.user._id, rating, title, comment, images });
    await recalcRating(productId);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "You already reviewed this product" });
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (review) await recalcRating(review.product);
    res.json({ message: "Review deleted" });
  } catch (err) { next(err); }
};
