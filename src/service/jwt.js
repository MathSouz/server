require("dotenv/config");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT;

const expiresIn = "1h";

const sign = (payload) => {
  return jwt.sign(payload, SECRET);
};

const verify = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { sign, verify };
