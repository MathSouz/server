const { SchemaTypes } = require("mongoose");
const { mongoose } = require("../");
const { models } = require("../../_base/constants");

const commentSchema = mongoose.Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: models.user,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const comment = mongoose.model(models.comment, commentSchema);
module.exports = { comment };
