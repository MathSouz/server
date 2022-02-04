const { isValidObjectId } = require("mongoose")
const { comment, post } = require("../../database/models")
const { roles } = require("../_base/constants")
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} = require("../_base/error")

exports.deleteComment = async (user, commentId) => {
  const foundComment = await comment
    .findById(commentId)
    .populate("user")
    .populate({ path: "post", populate: { path: "user" } })

  if (!foundComment) {
    throw new NotFoundError()
  }

  if (
    user.userId == foundComment.user._id ||
    user.role === roles.ADMIN ||
    user.userId == foundComment.post.user._id
  ) {
    foundComment.remove()
  } else {
    throw new UnauthorizedError()
  }
}

exports.createComment = async (userId, postId, text) => {
  if (!isValidObjectId(postId)) {
    throw new BadRequestError("Invalid post id.")
  }

  if (!(await post.exists({ _id: postId }))) {
    throw new NotFoundError("Post not found.")
  }

  if (!text) {
    throw new BadRequestError("No text.")
  }

  return comment.create({
    user: userId,
    post: postId,
    text
  })
}

exports.getPostComments = async (postId, limit = 10, page = 1) => {
  const options = { limit, page, sort: { createdAt: -1 } }
  return comment.paginate({ post: postId }, options)
}
