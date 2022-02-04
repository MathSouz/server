require("dotenv/config")
const { token } = require("../../database/models")
const { NotFoundError, ForbiddenError } = require("../_base/error")

exports.sign = async user => {
  await token.deleteMany({ user: user._id })
  const generatedToken = await token.create({ user })
  return generatedToken.token
}

exports.verify = async theToken => {
  const foundToken = await token.findOne({ token: theToken }).populate("user")

  if (!foundToken) {
    throw new NotFoundError("Token not found.")
  }

  if (new Date() >= foundToken.expiresAt) {
    throw new ForbiddenError("Expired.")
  }

  return foundToken.user._id
}

exports.revoke = async theToken => {
  const deleted = await token.deleteMany({ token: theToken })
  return deleted.deletedCount > 0
}
