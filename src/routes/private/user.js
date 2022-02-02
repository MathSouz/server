const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/userAuthenticated");
const {
  me,
  changeUsername,
  changePassword,
  changeRole,
  logout,
} = require("../../controller/user");

router
  .use(isAuthenticated)
  .get("/me", me)
  .put("/change/username", changeUsername)
  .put("/change/password", changePassword)
  .put("/change/role/:targetId", changeRole)
  .delete("/logout", logout);

module.exports = router;
