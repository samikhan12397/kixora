import Product from "../models/Product.js";

// @route GET /api/products
// Supports: ?search=&brand=&category=&gender=&minPrice=&maxPrice=&size=&sort=&page=&limit=&tag=
export const getProducts = async (req, res, next) => {
  try {
    const {
      search, brand, category, gender, minPrice, maxPrice, size,
      sort = "-createdAt", page = 1, limit = 12, tag,
    } = req.query;

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (size) filter.sizes = Number(size);
    if (tag) filter.tags = tag;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate("brand category").sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("brand category");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({ product, related });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedGroups = async (req, res, next) => {
  try {
    const [featured, newArrivals, bestSellers, limitedEdition] = await Promise.all([
      Product.find({ isFeatured: true }).limit(8),
      Product.find({ isNewArrival: true }).sort("-createdAt").limit(8),
      Product.find({ isBestSeller: true }).limit(8),
      Product.find({ isLimitedEdition: true }).limit(8),
    ]);
    res.json({ featured, newArrivals, bestSellers, limitedEdition });
  } catch (err) {
    next(err);
  }
};

// ----- Admin -----
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
