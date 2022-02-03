const { BadRequestError } = require("../_base/error")

const verifyPaginationParams = (req, res, next) => {
  const MIN_LIMIT = 1
  const MAX_LIMIT = 20
  const { limit = 10, page = 1 } = req.query

  if (limit < MIN_LIMIT) {
    throw new BadRequestError(
      `Minimum limit: ${MIN_LIMIT}. Requested: ${limit}.`
    )
  } else if (limit > MAX_LIMIT) {
    throw new BadRequestError(
      `Maximum limit: ${MAX_LIMIT}. Requested: ${limit}.`
    )
  }

  if (page < 1) {
    throw new BadRequestError(
      `Invalid page. Minimum page: 1, Requested: ${page}`
    )
  }

  req.pagination = {
    limit,
    page
  }

  next()
}

module.exports = verifyPaginationParams
