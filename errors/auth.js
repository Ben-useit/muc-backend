const { StatusCodes } = require("http-status-codes");
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = AuthenticationError;
