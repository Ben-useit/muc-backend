const { StatusCodes } = require("http-status-codes");
class GeneralAPIError extends Error {
  constructor(message) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

module.exports = GeneralAPIError;
