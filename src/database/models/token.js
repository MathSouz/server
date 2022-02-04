const { mongoose } = require("../")
const randomstring = require("randomstring")
const { models } = require("../../_base/constants")
const { SchemaTypes } = require("mongoose")

const generateExpirationDate = () => {
  const dt = new Date()
  dt.setDate(dt.getDate() + 1)
  return dt
}

const tokenSchema = mongoose.Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      required: true
    },
    token: {
      type: String,
      required: true,
      default: randomstring.generate
    },
    expiresAt: {
      type: Date,
      default: generateExpirationDate
    }
  },
  { timestamps: true }
)

const token = mongoose.model(models.token, tokenSchema)
module.exports = { token }
