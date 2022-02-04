const { httpStatusCodes } = require("../_base/constants")
const {
  registerUser,
  loginUser,
  logoutUser,
  changeRole,
  changePassword,
  changeUsername,
  changeAvatar,
  getUser,
  banUser
} = require("../service/user")
const sanitize = require("mongo-sanitize")

exports.getUser = async (req, res, next) => {
  const { userId } = sanitize(req.params)

  try {
    const foundUser = await getUser(userId)
    return res.json(foundUser)
  } catch (err) {
    return next(err)
  }
}

exports.me = async (req, res, next) => {
  try {
    const userObj = req.user
    return res.json(userObj)
  } catch (err) {
    return next(err)
  }
}

exports.changeAvatar = async (req, res, next) => {
  const user = req.user

  try {
    changeAvatar(req, res, user)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.changeUsername = async (req, res, next) => {
  const { username } = sanitize(req.body)
  const user = req.user

  try {
    await changeUsername(user, username)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    console.log(err)
    return next(err)
  }
}

exports.changePassword = async (req, res, next) => {
  const { password } = sanitize(req.body)
  const user = req.user

  try {
    await changePassword(user, password)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.changeRole = async (req, res, next) => {
  const user = req.user
  const { targetId } = sanitize(req.params)
  const { newRole } = sanitize(req.body)

  try {
    await changeRole(user, targetId, newRole)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.logout = async (req, res, next) => {
  const token = req.token
  try {
    await logoutUser(token)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = sanitize(req.body)

  try {
    const response = await loginUser(email, password)
    return res.json(response)
  } catch (err) {
    return next(err)
  }
}

exports.register = async (req, res, next) => {
  const { username, email, password } = sanitize(req.body)

  try {
    const createdUser = await registerUser(username, email, password)
    return res.json(createdUser)
  } catch (err) {
    return next(err)
  }
}

exports.banUser = async (req, res, next) => {
  const { userId } = sanitize(req.params)
  try {
    await banUser(userId, true)

    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.pardonUser = async (req, res, next) => {
  const { userId } = sanitize(req.params)
  try {
    await banUser(userId, false)

    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}
