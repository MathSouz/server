const express = require("express");
const router = express.Router();
const {
  getRecentPosts,
  getPublicPost,
  getTagsWithOccurrences,
  getTags,
  getUserRecentPosts,
} = require("../../controller/post");

router
  .get("/", getRecentPosts)
  .get("/:postId", getPublicPost)
  .get("/tags/occurences", getTagsWithOccurrences)
  .get("/tags/all", getTags);

module.exports = router;
