const sanitize = require("mongo-sanitize")
const {
  createComment,
  deleteComment,
  getPostComments,
  getComment
} = require("../service/comment")
const { httpStatusCodes } = require("../_base/constants")

exports.getComment = async (req, res, next) => {
  const { commentId } = req.params

  try {
    const foundComment = await getComment(commentId)
    return res.json(foundComment)
  } catch (err) {
    return next(err)
  }
}

exports.createComment = async (req, res, next) => {
  const { _id } = req.user
  const { postId } = sanitize(req.params)
  const { text } = sanitize(req.body)
  try {
    const createdComment = await createComment(_id, postId, text)
    return res.json(createdComment)
  } catch (err) {
    return next(err)
  }
}

exports.deleteComment = async (req, res, next) => {
  const user = req.user
  const { commentId } = sanitize(req.params)
  try {
    await deleteComment(user, commentId)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.getPostComments = async (req, res, next) => {
  const { postId } = sanitize(req.params)
  const { page = 1, limit = 10 } = sanitize(req.query)

  try {
    const pagedComments = await getPostComments(postId, limit, page)
    return res.json(pagedComments)
  } catch (err) {
    return next(err)
  }
}
