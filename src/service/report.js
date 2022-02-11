const { isValidObjectId } = require("mongoose")
const { report, post, comment, user } = require("../../database/models")
const { VALID_REPORT_TARGETS, models } = require("../../src/_base/constants")
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} = require("../_base/error")

exports.getReport = async reportId => {
  if (!isValidObjectId(reportId)) {
    throw new BadRequestError()
  }

  return report.findById(reportId).populate("user")
}

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
  if (!isValidObjectId(reportId)) {
    throw new BadRequestError("Invalid id.")
  }

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
  const foundUser = await user.findById(target).lean()

  if (!foundUser) {
    throw new NotFoundError()
  }

  await createReport(currentUser, text, foundUser, VALID_REPORT_TARGETS[0])
}

exports.createCommentReport = async (currentUser, text, target) => {
  const foundComment = await comment
    .findById(target)
    .select("+post")
    .populate([
      { path: "user", model: models.user },
      {
        path: "post",
        model: models.post,
        populate: [
          {
            path: "user",
            model: models.user
          },
          {
            path: "loveReactions",
            model: models.user
          },
          {
            path: "hateReactions",
            model: models.user
          }
        ]
      }
    ])
    .lean()

  if (!foundComment) {
    throw new NotFoundError()
  }

  await createReport(currentUser, text, foundComment, VALID_REPORT_TARGETS[2])
}

exports.createPostReport = async (currentUser, text, target) => {
  const foundPost = await post
    .findById(target)
    .populate([
      { path: "user", model: models.user },
      { path: "loveReactions", model: models.user },
      { path: "hateReactions", model: models.user }
    ])
    .lean()

  if (!foundPost) {
    throw new NotFoundError()
  }

  await createReport(currentUser, text, foundPost, VALID_REPORT_TARGETS[1])
}

const createReport = async (currentUser, text, target, object) => {
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

  await report.create({
    user: _id,
    text,
    target,
    object
  })
}
