exports.roles = {
  NORMIE: "NORMIE",
  ADMIN: "ADMIN",
};

exports.httpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

exports.models = {
  user: "user",
  post: "post",
  comment: "comment",
  reaction: "reaction",
  token: "token",
  report: "report",
};

exports.VALID_REPORT_TARGETS = [models.user, models.post, models.comment];
