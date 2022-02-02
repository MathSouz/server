const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const mongoosePaginate = require("mongoose-paginate-v2")
const { models } = require("../../_base/constants")

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
    reactions: {
      type: [{ type: SchemaTypes.ObjectId, ref: models.reaction }]
    },
    comments: {
      type: [{ type: SchemaTypes.ObjectId, ref: models.comments }]
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
