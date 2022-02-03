require("dotenv/config")
const { token } = require("../database/models/token")
const { NotFoundError, ForbiddenError } = require("../_base/error")

exports.sign = async userId => {
  await token.deleteMany({ userId })
  const generatedToken = await token.create({ userId })
  return generatedToken.token
}

exports.verify = async theToken => {
  const foundToken = await token.findOne({ token: theToken })

  if (!foundToken) {
    throw new NotFoundError("Token not found.")
  }

  if (new Date() >= foundToken.expiresAt) {
    throw new ForbiddenError("Expired.")
  }

  return foundToken.userId
}

exports.revoke = async theToken => {
  const deleted = await token.deleteMany({ token: theToken })
  return deleted.deletedCount > 0
}
