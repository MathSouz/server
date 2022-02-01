const BadRequestError = require("../error/badRequestError");
const ForbiddenError = require("../error/forbiddenError");
const NotFoundError = require("../error/notFoundError");
const UnauthorizedError = require("../error/unauthorizedError");
const InternalServerError = require("../error/internalServerError");

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
};
