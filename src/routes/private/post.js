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

router
  .use(isAuthenticated)
  .post("/create", uploadPostImage.single("image"), createPost)
  .put("/:postId/react", reactPost)
  .delete("/:postId", deletePost)
  .get("/:postId", getPost)
  .get("/", verifyPaginationParams, getAllPosts)
  .get("/get/rank", verifyPaginationParams, getRankedPosts)
  .post("/:postId/comment", createComment)
  .get("/:postId/comment", getPostComments)
  .delete("/comment/:commentId", deleteComment)

module.exports = router
