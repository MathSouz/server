const { user } = require("../../database/models")
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
} = require("../_base/error")
const { sign, revoke } = require("./token")
const { roles } = require("../_base/constants")
const { isValidObjectId } = require("mongoose")
const { compareSync, hashSync } = require("./bcrypt")
const { uploadUserImage } = require("./s3")

exports.registerUser = async (username, email, password) => {
  if (!username) {
    throw new BadRequestError("No username.")
  }

  if (!email) {
    throw new BadRequestError("No email.")
  }

  if (!password) {
    throw new BadRequestError("No password.")
  }

  const createdUser = await user.create({ username, email, password })
  createdUser.password = undefined
  const token = await sign(createdUser)
  return { createdUser: user, token }
}

exports.loginUser = async (email, password) => {
  if (!email) {
    throw new BadRequestError("No email.")
  }

  if (!password) {
    throw new BadRequestError("No password.")
  }

  const foundUser = await user
    .findOne({ email })
    .select("+password")
    .select("+email")
    .select("+banned")

  if (!foundUser) {
    throw new UnauthorizedError("Invalid credentials.")
  }

  if (foundUser.banned) {
    throw new ForbiddenError("This user has been banned.")
  }

  if (!compareSync(password, foundUser.password)) {
    throw new UnauthorizedError("Invalid credentials.")
  }

  const token = await sign(foundUser)
  return { token }
}

exports.logoutUser = async token => {
  const revoked = await revoke(token)
  if (!revoked) {
    throw new UnauthorizedError("Token revoked.")
  }
}

exports.changeRole = async (currentUser, targetId, newRole) => {
  if (!newRole) {
    throw new BadRequestError("No role declared.")
  }

  const selectedRole = roles[newRole]

  if (!selectedRole) {
    throw new BadRequestError("Invalid role.")
  }

  if (!targetId) {
    throw new BadRequestError("No target user id.")
  }

  const update = await user.updateOne({ _id: targetId }, { role: selectedRole })

  if (!update.modifiedCount) {
    throw new ForbiddenError(`This user is a ${newRole} already.`)
  }
}

exports.changePassword = async (currentUser, password) => {
  if (!password) {
    throw new BadRequestError("No password.")
  }

  const encryptedPassword = hashSync(password, 10)
  const update = await user.updateOne(
    { _id: currentUser._id },
    { password: encryptedPassword }
  )

  if (!update.modifiedCount) {
    throw new ForbiddenError("Your password didn't changed")
  }
}

exports.changeUsername = async (currentUser, username) => {
  if (!username) {
    throw new BadRequestError("No username.")
  }

  const update = await user.updateOne({ _id: currentUser._id }, { username })
  if (!update.modifiedCount) {
    throw new ForbiddenError("Your username didn't changed")
  }
}

exports.changeAvatar = async (req, res, currentUser) => {
  const { file } = req

  const avatarUrl = file
    ? {
        location: file.location,
        key: file.key
      }
    : null
  const beforeUpdated = await user.findByIdAndUpdate(currentUser._id, {
    avatarUrl
  })

  if (beforeUpdated.avatarUrl && !file) {
    deleteImage(beforeUpdated.avatarUrl.key)
  }
}

exports.getUser = async userId => {
  if (!userId) {
    throw new BadRequestError("No user.")
  }

  if (!isValidObjectId(userId)) {
    throw new NotFoundError()
  }

  const foundUser = await user.findById(userId)

  if (!foundUser) {
    throw new NotFoundError()
  }

  return foundUser
}
exports.banUser = async (userId, banned = true) => {
  if (!userId) {
    throw new BadRequestError("No user id.")
  }

  if (!isValidObjectId(userId)) {
    throw new BadRequestError("Invalid user id.")
  }

  await user.updateOne({ _id: userId }, { banned })
}
