require("dotenv/config");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../controller/token");

const SECRET = process.env.JWT;

const sign = async (payload) => {
  return (await generateToken(payload)).token;
};

const verify = async (token) => {
  return await verifyToken(token);
};

module.exports = { sign, verify };
