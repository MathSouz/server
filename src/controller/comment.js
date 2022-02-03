const {
  createComment,
  deleteComment,
  getPostComments
} = require("../service/comment")
const { httpStatusCodes } = require("../_base/constants")

exports.createComment = async (req, res, next) => {
  const { _id } = req.user
  const { postId } = req.params
  const { text } = req.body
  try {
    const createdComment = await createComment(_id, postId, text)
    return res.json(createdComment)
  } catch (err) {
    return next(err)
  }
}

exports.deleteComment = async (req, res, next) => {
  const user = req.user
  const { commentId } = req.params
  try {
    await deleteComment(user, commentId)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.getPostComments = async (req, res, next) => {
  const { postId } = req.params
  const { page = 1, limit = 10 } = req.query

  try {
    const pagedComments = await getPostComments(postId, limit, page)
    return res.json(pagedComments)
  } catch (err) {
    return next(err)
  }
}
