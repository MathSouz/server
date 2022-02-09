const sanitize = require("mongo-sanitize")
const { isValidObjectId } = require("mongoose")
const {
  createUserReport,
  createPostReport,
  createCommentReport,
  getRecentReports,
  solveReport
} = require("../service/report")
const { httpStatusCodes } = require("../_base/constants")
const { BadRequestError } = require("../_base/error")

exports.solveReport = async (req, res, next) => {
  const { reportId } = sanitize(req.params)
  try {
    if (!isValidObjectId(reportId)) {
      throw new BadRequestError("Invalid id.")
    }
    await solveReport(reportId)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.getRecentReports = async (req, res, next) => {
  const { limit, page, solved } = sanitize(req.query)
  try {
    const result = await getRecentReports(solved, limit, page)
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

exports.createUserReport = async (req, res, next) => {
  const user = req.user
  const { text } = sanitize(req.body)
  const { target } = sanitize(req.params)

  try {
    await createUserReport(user, text, target)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.createPostReport = async (req, res, next) => {
  const user = req.user
  const { text } = sanitize(req.body)
  const { target } = sanitize(req.params)
  try {
    await createPostReport(user, text, target)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.createCommentReport = async (req, res, next) => {
  const user = req.user
  const { text } = sanitize(req.body)
  const { target } = sanitize(req.params)
  try {
    await createCommentReport(user, text, target)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}
