import User from "../models/User.js";

export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses);
  } catch (err) { next(err); }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) { next(err); }
};

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    Object.assign(addr, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
};
