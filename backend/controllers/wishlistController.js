import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json(wishlist);
  } catch (err) { next(err); }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const idx = wishlist.products.findIndex((p) => p.toString() === productId);
    let added;
    if (idx > -1) { wishlist.products.splice(idx, 1); added = false; }
    else { wishlist.products.push(productId); added = true; }

    await wishlist.save();
    await wishlist.populate("products");
    res.json({ wishlist, added });
  } catch (err) { next(err); }
};
