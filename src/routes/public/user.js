const express = require("express");
const router = express.Router();
const { login, register } = require("../../controller/user");

router.get("/login", login).post("/register", register);

module.exports = router;
