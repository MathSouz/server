const sanitize = require("mongo-sanitize")
const { isValidObjectId } = require("mongoose")
const {
  createUserReport,
  createPostReport,
  createCommentReport,
  getRecentReports,
  solveReport,
  getReport
} = require("../service/report")
const { httpStatusCodes } = require("../_base/constants")

exports.getReport = async (req, res, next) => {
  const { reportId } = sanitize(req.params)

  try {
    const foundReport = await getReport(reportId)
    return res.json(foundReport)
  } catch (err) {
    return next(err)
  }
}

exports.solveReport = async (req, res, next) => {
  const { reportId } = sanitize(req.params)
  try {
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
