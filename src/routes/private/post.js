const express = require("express")
const router = express.Router()
const { isAuthenticated } = require("../../middleware/userAuthenticated")
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  reactPost
} = require("../../controller/post")

router
  .use(isAuthenticated)
  .post("/create", createPost)
  .put("/:postId/react", reactPost)
  .delete("/:postId", deletePost)
  .get("/:postId", getPost)
  .get("/", getAllPosts)

module.exports = router
