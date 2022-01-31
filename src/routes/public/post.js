const express = require("express");
const router = express.Router();
const { getRecentPosts, getPublicPost } = require("../../controller/post");

router.get("/", getRecentPosts).get("/:postId", getPublicPost);

module.exports = router;
