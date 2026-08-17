import Category from "../models/Category.js";

export const getCategories = async (req, res, next) => {
  try {
    res.json(await Category.find());
  } catch (err) { next(err); }
};

export const createCategory = async (req, res, next) => {
  try {
    res.status(201).json(await Category.create(req.body));
  } catch (err) { next(err); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (err) { next(err); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) { next(err); }
};
