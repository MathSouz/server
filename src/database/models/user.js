const { SchemaTypes } = require("mongoose");
const { mongoose } = require("../");
const { hashSync } = require("../../service/bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    select: false,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    required: true,
    default: "NORMIE",
  },
  avatarUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  following: {
    type: [{ type: SchemaTypes.ObjectId, ref: "user" }],
    default: [],
  },
});

userSchema.pre("save", function (next) {
  this.password = hashSync(this.password);
  next();
});

const user = mongoose.model("user", userSchema);

module.exports = { user };
