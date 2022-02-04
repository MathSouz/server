const express = require("express")
const router = express.Router()
const { isAuthenticated } = require("../../middleware/userAuthenticated")
const {
  me,
  changeUsername,
  changePassword,
  changeRole,
  logout,
  changeAvatar,
  getUser,
  banUser,
  pardonUser
} = require("../../controller/user")
const { uploadUserImage } = require("../../service/s3")
const isUserAdmin = require("../../middleware/isUserAdmin")
const deleteInvalidImage = require("../../middleware/deleteInvalidImage")
const { MAX_IMAGE_SIZE } = require("../../_base/constants")

router
  .use(isAuthenticated)
  .get("/me", me)
  .put("/change/username", changeUsername)
  .put("/change/password", changePassword)
  .put("/change/role/:targetId", isUserAdmin, changeRole)
  .put(
    "/change/avatar",
    uploadUserImage,
    deleteInvalidImage(MAX_IMAGE_SIZE.avatar),
    changeAvatar
  )
  .delete("/logout", logout)
  .get("/:userId", getUser)
  .put("/admin/ban/:userId", isUserAdmin, banUser)
  .put("/admin/pardon/:userId", isUserAdmin, pardonUser)

module.exports = router
