const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const { models } = require("../../_base/constants")
const mongoosePaginate = require("mongoose-paginate-v2")

const commentSchema = mongoose.Schema(
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
    text: {
      type: String,
      required: true
    },
    likers: [{ type: SchemaTypes.ObjectId, ref: models.user }]
  },
  { timestamps: true }
)

commentSchema.plugin(mongoosePaginate)

const comment = mongoose.model(models.comment, commentSchema)
module.exports = { comment }
