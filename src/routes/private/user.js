const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/userAuthenticated");
const {
  me,
  changeUsername,
  changePassword,
  changeRole,
  followUser,
  unfollowUser,
  logout,
} = require("../../controller/user");

router
  .use(isAuthenticated)
  .get("/me", me)
  .put("/change/username", changeUsername)
  .put("/change/password", changePassword)
  .put("/change/role/:targetId", changeRole)
  .post("/followers/add/:targetUserId", followUser)
  .delete("/logout", logout)
  .delete("/followers/remove/:targetUserId", unfollowUser);

module.exports = router;
