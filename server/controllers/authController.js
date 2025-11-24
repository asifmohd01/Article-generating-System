const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hash });
    // Simulate email verification
    const token = signToken(user);
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link was sent" });
    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    await user.save();
    // Simulate sending email with reset token
    res.json({
      message: "Password reset token generated (simulated)",
      resetToken: token,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ resetToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  // Dummy verification
  res.json({ message: "Email verification simulated" });
};
