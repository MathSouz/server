const { mongoose } = require("../")
const { hashSync } = require("../../src/service/bcrypt")
const { roles, models } = require("../../src/_base/constants")

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      select: false
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      required: true,
      default: roles.NORMIE
    },
    avatarUrl: {
      type: Object
    },
    banned: {
      type: Boolean,
      select: false
    }
  },
  { timestamps: true }
)

userSchema.pre("save", function (next) {
  this.password = hashSync(this.password)
  next()
})

const user = mongoose.model(models.user, userSchema)

module.exports = { user }
