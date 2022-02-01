require("dotenv/config");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../controller/token");

const SECRET = process.env.JWT;

exports.expiresAt = () => {
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  return dt;
};

exports.sign = async (payload) => {
  return (await generateToken(payload)).token;
};

exports.verify = async (token) => {
  return await verifyToken(token);
};
