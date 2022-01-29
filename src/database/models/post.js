const { SchemaTypes } = require("mongoose");
const { mongoose } = require("../");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = mongoose.Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.plugin(mongoosePaginate);

const post = mongoose.model("post", postSchema);
module.exports = { post };
