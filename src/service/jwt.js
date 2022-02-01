require("dotenv/config");
const { generateToken, verifyToken } = require("../controller/token");

exports.sign = async (payload) => {
  return (await generateToken(payload)).token;
};

exports.verify = async (token) => {
  return await verifyToken(token);
};
