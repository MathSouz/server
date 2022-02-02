const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const mongoosePaginate = require("mongoose-paginate-v2")
const { models, VALID_MOODS } = require("../../_base/constants")

const postSchema = mongoose.Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: models.user,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    loveReactions: {
      type: [{ type: SchemaTypes.ObjectId, ref: models.user }]
    },
    hateReactions: {
      type: [{ type: SchemaTypes.ObjectId, ref: models.user }]
    },
    comments: {
      type: [{ type: SchemaTypes.ObjectId, ref: models.comment }]
    },
    imageUrl: {
      type: String
    },
    tags: []
  },
  { timestamps: true }
)

postSchema.plugin(mongoosePaginate)

const post = mongoose.model(models.post, postSchema)
module.exports = { post }
