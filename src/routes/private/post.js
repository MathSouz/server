const express = require("express")
const router = express.Router()
const { isAuthenticated } = require("../../middleware/userAuthenticated")
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  reactPost,
  getRankedPosts
} = require("../../controller/post")
const { uploadPostImage } = require("../../service/s3")
const {
  createComment,
  getPostComments,
  deleteComment
} = require("../../controller/comment")
const verifyPaginationParams = require("../../middleware/verifyPaginationParams")
const deleteInvalidImage = require("../../middleware/deleteInvalidImage")
const { MAX_IMAGE_SIZE } = require("../../_base/constants")

router
  .use(isAuthenticated)
  .post(
    "/create",
    uploadPostImage,
    deleteInvalidImage(MAX_IMAGE_SIZE.post),
    createPost
  )
  .put("/:postId/react", reactPost)
  .delete("/:postId", deletePost)
  .get("/:postId", getPost)
  .get("/", verifyPaginationParams, getAllPosts)
  .get("/get/rank", verifyPaginationParams, getRankedPosts)
  .post("/:postId/comment", createComment)
  .get("/:postId/comment", verifyPaginationParams, getPostComments)
  .delete("/comment/:commentId", deleteComment)

module.exports = router
