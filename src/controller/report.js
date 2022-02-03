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
  const { reportId } = req.params
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
  const { limit, page, solved } = req.query
  try {
    const result = await getRecentReports(limit, page, solved)
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}

exports.createUserReport = async (req, res, next) => {
  const user = req.user
  const { text } = req.body
  const { target } = req.params

  try {
    const createdReport = await createUserReport(user, text, target)
    return res.json(createdReport)
  } catch (err) {
    return next(err)
  }
}

exports.createPostReport = async (req, res, next) => {
  const user = req.user
  const { text } = req.body
  const { target } = req.params
  try {
    const createdReport = await createPostReport(user, text, target)
    return res.json(createdReport)
  } catch (err) {
    return next(err)
  }
}

exports.createCommentReport = async (req, res, next) => {
  const user = req.user
  const { text } = req.body
  const { target } = req.params
  try {
    const createdReport = await createCommentReport(user, text, target)
    return res.json(createdReport)
  } catch (err) {
    return next(err)
  }
}