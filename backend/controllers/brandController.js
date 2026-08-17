import Brand from "../models/Brand.js";

export const getBrands = async (req, res, next) => {
  try {
    res.json(await Brand.find());
  } catch (err) { next(err); }
};

export const createBrand = async (req, res, next) => {
  try {
    res.status(201).json(await Brand.create(req.body));
  } catch (err) { next(err); }
};

export const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(brand);
  } catch (err) { next(err); }
};

export const deleteBrand = async (req, res, next) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted" });
  } catch (err) { next(err); }
};
