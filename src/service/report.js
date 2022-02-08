const { isValidObjectId } = require("mongoose")
const { report, post, comment, user } = require("../../database/models")
const { VALID_REPORT_TARGETS, models } = require("../../src/_base/constants")
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} = require("../_base/error")

exports.getRecentReports = async (solved, limit = 10, page = 1) => {
  const options = {
    limit,
    page,
    sort: { createdAt: -1 },
    populate: [{ path: "user", model: "users" }]
  }
  const filter = solved === null || solved === undefined ? {} : { solved }

  return report.paginate(filter, options)
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

  return report.populate(createdReport, [{ path: "user", model: models.user }])
}
