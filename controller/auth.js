const User = require("../models/user");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils");
const { createTokenUser } = require("../utils/jwt");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { log } = require("console");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const origin = "http://localhost:5173";
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    console.log("email exists");
    return res.status(500).json({ msg: "email exists." });
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({ name, email, password, verificationToken });

  await sendVerificationEmail({ name, email, verificationToken, origin });
  res.status(200).json({ user });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: "No such user." });
  }
  if (!(user.verificationToken === verificationToken))
    return res.status(401).json({ msg: "Token no match." });
  user.isVerified = true;
  user.verificationToken = "";
  user.verified = Date.now();
  await user.updateOne({
    isVerified: true,
    verificationToken: "",
    verified: Date.now(),
  });
  res.status(200).json({ msg: "All good.", user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");
  const user = await User.findOne({ email });
  if (!user)
    throw new BadRequestError(
      "Wrong credentials. Invalid username or password."
    );
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    throw new BadRequestError(
      "Wrong credentials. Invalid username or password."
    );
  if (!user.isVerified) throw new BadRequestError("Please verify your email.");
  const tokenUser = await createTokenUser(user);
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", tokenUser, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "lax",
  });
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "lax",
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

module.exports = { verifyEmail, register, login, showCurrentUser, logout };
