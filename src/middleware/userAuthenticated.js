const { user } = require("../database/models/user")
const { verify } = require("../service/token")
const { NotFoundError, BadRequestError } = require("../_base/error")

const isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers

  try {
    if (!authorization) {
      throw new BadRequestError({ message: "Token not found" })
    }

    const authorizationToken = authorization.split(" ")

    if (authorizationToken.length != 2) {
      throw new BadRequestError({ message: "Bad format token" })
    }

    if (authorizationToken[0] !== "Bearer") {
      throw new BadRequestError({ message: "Bad format token" })
    }

    const token = authorizationToken[1]

    const id = await verify(token)
    const userFound = await user.findById(id).select("+banned")

    if (!userFound) {
      throw new NotFoundError("User not found.")
    }

    if (userFound.banned) {
      throw new UnauthorizedError("This user has benn banned.")
    }

    req.user = userFound
    req.token = token
    next()
  } catch (err) {
    return err
  }
}

module.exports = { isAuthenticated }
