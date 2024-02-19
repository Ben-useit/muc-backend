const { verifyToken } = require("../utils/jwt");
const { AuthenticationError } = require("../errors");
const authMiddleware = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) throw new AuthenticationError("No valid token provided.");
  const accessToken = await verifyToken(token);
  req.user = accessToken; // { name, email, _id };
  next();
};

module.exports = authMiddleware;
