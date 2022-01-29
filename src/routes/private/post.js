const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/userAuthenticated");
const {
  createPost,
  getMyRecentPosts,
  getUserRecentPosts,
} = require("../../controller/post");

router
  .use(isAuthenticated)
  .post("/create", createPost)
  .get("/", getMyRecentPosts)
  .get("/:targetUserId", getUserRecentPosts);

module.exports = router;
