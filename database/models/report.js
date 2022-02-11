const { SchemaTypes } = require("mongoose")
const { mongoose } = require("../")
const { models, VALID_REPORT_TARGETS } = require("../../src/_base/constants")
const mongoosePaginate = require("mongoose-paginate-v2")

const reportSchema = mongoose.Schema(
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
    target: {
      type: Object,
      required: true
    },
    object: {
      type: String,
      enum: VALID_REPORT_TARGETS,
      required: true
    },
    solved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

reportSchema.plugin(mongoosePaginate)

const report = mongoose.model(models.report, reportSchema)
module.exports = { report }
