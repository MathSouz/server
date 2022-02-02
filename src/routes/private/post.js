const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/userAuthenticated");
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} = require("../../controller/post");

router
  .use(isAuthenticated)
  .post("/create", createPost)
  .delete("/:postId", deletePost)
  .get("/:postId", getPost)
  .get("/", getAllPosts);

module.exports = router;
