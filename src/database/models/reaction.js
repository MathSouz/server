const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const { models, VALID_MOODS } = require("../../_base/constants")

const reactionSchema = mongoose.Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: models.user,
      required: true
    },
    post: {
      type: SchemaTypes.ObjectId,
      ref: models.post,
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
