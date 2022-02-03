const express = require("express")
const router = express.Router()
const { isAuthenticated } = require("../../middleware/userAuthenticated")
const {
  me,
  changeUsername,
  changePassword,
  changeRole,
  logout,
  changeAvatar
} = require("../../controller/user")
const { uploadPostImage, uploadUserImage } = require("../../service/s3")

router
  .use(isAuthenticated)
  .get("/me", me)
  .put("/change/username", changeUsername)
  .put("/change/password", changePassword)
  .put("/change/role/:targetId", changeRole)
  .put("/change/avatar", uploadUserImage.single("image"), changeAvatar)
  .delete("/logout", logout)

module.exports = router
