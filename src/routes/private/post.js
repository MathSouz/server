const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/userAuthenticated");
const {
  createPost,
  getMyRecentPosts,
  getUserRecentPosts,
  getPost,
} = require("../../controller/post");

router
  .use(isAuthenticated)
  .post("/create", createPost)
  .get("/", getMyRecentPosts)
  .get("/user/:targetUserId", getUserRecentPosts)
  .get("/:postId", getPost);

module.exports = router;
