const express = require("express");
const {
  getLoggedUserData,
  getuser,
  refreshToken,
  signup,
  login,
  protect,
} = require("../controllers/authController");
const router = express.Router();

router.get("/:id", protect, getLoggedUserData);
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
module.exports = router;
