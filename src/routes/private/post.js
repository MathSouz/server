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
const { upload } = require("../../service/s3")

router
  .use(isAuthenticated)
  .post("/create", upload.single("image"), createPost)
  .put("/:postId/react", reactPost)
  .delete("/:postId", deletePost)
  .get("/:postId", getPost)
  .get("/", getAllPosts)
  .get("/get/rank", getRankedPosts)

module.exports = router
