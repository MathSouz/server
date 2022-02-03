const { roles } = require("../_base/constants")
const { UnauthorizedError } = require("../_base/error")

const isUserAdmin = (req, res, next) => {
  const { role } = req.user

  if (role !== roles.ADMIN) {
    throw new UnauthorizedError()
  }

  next()
}

module.exports = isUserAdmin
