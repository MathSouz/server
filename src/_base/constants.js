const MAX_IMAGE_SIZE = {
  avatar: 1024 * 1024 * 2,
  post: 1024 * 1024 * 5
}

const roles = {
  NORMIE: "NORMIE",
  ADMIN: "ADMIN"
}

const httpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500
}

const models = {
  user: "users",
  post: "posts",
  comment: "comments",
  reaction: "reactions",
  token: "tokens",
  report: "reports"
}

const VALID_REPORT_TARGETS = [models.user, models.post, models.comment]

const VALID_MOODS = ["none", "love", "hate"]

module.exports = {
  models,
  roles,
  VALID_MOODS,
  VALID_REPORT_TARGETS,
  httpStatusCodes,
  MAX_IMAGE_SIZE
}
