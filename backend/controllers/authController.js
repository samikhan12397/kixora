import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const otp = generateOTP();
    const user = await User.create({
      name,
      email,
      password,
      phone,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    try {
      await sendEmail({
        to: email,
        subject: "Verify your KIXORA account",
        html: `<p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
      });
    } catch (e) {
      console.warn("Email not sent (SMTP not configured):", e.message);
    }

    res.status(201).json({
      message: "Registered. Check your email for the OTP.",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: "Account verified", token: generateToken(user._id), user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: generateToken(user._id), user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with that email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
      await sendEmail({
        to: email,
        subject: "Reset your KIXORA password",
        html: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a> (valid 30 min)</p>`,
      });
    } catch (e) {
      console.warn("Email not sent (SMTP not configured):", e.message);
    }

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
