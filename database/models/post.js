const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const mongoosePaginate = require("mongoose-paginate-v2")
const mongoosePaginateAggregate = require("mongoose-aggregate-paginate-v2")
const { models } = require("../../src/_base/constants")

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
    imageUrl: {
      type: Object
    },
    tags: []
  },
  { timestamps: true, strict: false }
)

postSchema.plugin(mongoosePaginate)
postSchema.plugin(mongoosePaginateAggregate)

const post = mongoose.model(models.post, postSchema)
module.exports = { post }
