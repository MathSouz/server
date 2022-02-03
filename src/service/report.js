const { isValidObjectId } = require("mongoose")
const { report } = require("../database/models/report")
const { VALID_REPORT_TARGETS, roles } = require("../_base/constants")
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} = require("../_base/error")
const { post } = require("../database/models/post")
const { comment } = require("../database/models/comment")
const { user } = require("../database/models/user")

exports.getRecentReports = async (limit = 10, page = 1, solved) => {
  const options = { limit, page, sort: { createdAt: -1 } }
  const filter = solved === null || solved === undefined ? {} : { solved }

  const result = await report.paginate(filter, options)
  return result
}

exports.solveReport = async reportId => {
  const updatedReport = await report.findByIdAndUpdate(
    { _id: reportId, solved: false },
    { solved: true }
  )

  if (!updatedReport) {
    throw new NotFoundError()
  }

  if (updatedReport.solved) {
    throw new ForbiddenError("Report already solved.")
  }
}

exports.createUserReport = async (currentUser, text, target) => {
  return createReport(currentUser, text, target, VALID_REPORT_TARGETS[0], user)
}

exports.createCommentReport = async (currentUser, text, target) => {
  return createReport(
    currentUser,
    text,
    target,
    VALID_REPORT_TARGETS[2],
    comment
  )
}

exports.createPostReport = async (currentUser, text, target) => {
  return createReport(currentUser, text, target, VALID_REPORT_TARGETS[1], post)
}

const createReport = async (currentUser, text, target, object, model) => {
  const { _id } = currentUser

  if (!text) {
    throw new BadRequestError("No text.")
  }

  if (!target) {
    throw new BadRequestError("No target.")
  }

  if (!VALID_REPORT_TARGETS.includes(object)) {
    throw new BadRequestError(
      `Invalid target object. Valid objects: ${VALID_REPORT_TARGETS.join(", ")}`
    )
  }

  if (!isValidObjectId(_id) || !isValidObjectId(target)) {
    throw new BadRequestError("Invalid id.")
  }

  const existsTarget = await model.exists({ _id: target })

  if (!existsTarget) {
    throw new NotFoundError("Target doesn't exist.")
  }

  const createdReport = await report.create({
    user: _id,
    text,
    target,
    object
  })

  return createdReport
}