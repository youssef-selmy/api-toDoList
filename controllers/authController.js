const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

// @desc    Signup
// @route   GET auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const { phone, password, displayName, experienceYears, address, level } =
    req.body;
  const user = await User.create({
    phone,
    password,
    displayName,
    experienceYears,
    address,
    level,
  });

  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   GET auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.status(200).json({ data: user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return res.status(401).json({
      message: "The user that belongs to this token no longer exists",
    });
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return res.status(401).json({
        message: "User recently changed their password. Please log in again.",
      });
    }
  }

  req.user = currentUser;
  next();
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token: newToken });
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

exports.getLoggedUserData = asyncHandler(async (req, res) => {
  res.status(200).json({ data: req.user });
});
