const { mongoose } = require("../");
const randomstring = require("randomstring");
const { expiresAt } = require("../../service/jwt");

const tokenSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    default: randomstring.generate,
  },
  expiresAt: {
    type: Date,
    default: expiresAt,
  },
});

const token = mongoose.model("token", tokenSchema);
module.exports = { token };
