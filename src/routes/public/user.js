const express = require("express")
const router = express.Router()
const { login, register, getUser } = require("../../controller/user")

router.post("/login", login).post("/register", register)

module.exports = router
