const express = require("express");
const {
  verifyEmail,
  register,
  login,
  showCurrentUser,
  logout,
} = require("../controller/auth");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email").post(verifyEmail);
router.route("/showMe").get(authMiddleware, showCurrentUser);
router.route("/logout").delete(authMiddleware, logout);

module.exports = router;
