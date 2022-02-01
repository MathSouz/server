const { mongoose } = require("../");
const randomstring = require("randomstring");

const expiresAt = () => {
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  return dt;
};

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
