const { httpStatusCodes } = require("../constants");
const BaseError = require("./baseError");

class UnauthorizedError extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNAUTHORIZED,
    description = "Unauthorized.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = UnauthorizedError;
