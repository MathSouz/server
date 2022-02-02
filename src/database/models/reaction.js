const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const { models } = require("../../_base/constants")

exports.VALID_MOODS = ["love", "hate"]

const reactionSchema = mongoose.Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: models.user,
      required: true
    },
    mood: {
      type: String,
      enum: VALID_MOODS,
      default: [0],
      required: true
    }
  },
  { timestamps: true }
)

const reaction = mongoose.model(models.reaction, reactionSchema)
module.exports = { reaction }
