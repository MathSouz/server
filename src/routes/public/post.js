const express = require("express");
const router = express.Router();
const { getRecentPosts } = require("../../controller/post");

router.get("/", getRecentPosts);

module.exports = router;
