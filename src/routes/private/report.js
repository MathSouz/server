const express = require("express")
const {
  createUserReport,
  createPostReport,
  createCommentReport,
  solveReport,
  getRecentReports,
  getReport
} = require("../../controller/report")
const router = express.Router()
const { isAuthenticated } = require("../../middleware/userAuthenticated")
const isUserAdmin = require("../../middleware/isUserAdmin")

router
  .use(isAuthenticated)
  .post("/user/:target", createUserReport)
  .post("/post/:target", createPostReport)
  .post("/comment/:target", createCommentReport)
  .get("/admin/recent", isUserAdmin, getRecentReports)
  .get("/admin/:reportId", isUserAdmin, getReport)
  .put("/admin/solve/:reportId", isUserAdmin, solveReport)

module.exports = router
