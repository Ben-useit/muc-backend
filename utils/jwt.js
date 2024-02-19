const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

const createTokenUser = async (user) => {
  const { name, email, _id } = user;
  const token = await jwt.sign({ name, email, _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const verifyToken = async (token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    throw new BadRequestError("No valid Token provided.");
  }
};

module.exports = { createTokenUser, verifyToken };
