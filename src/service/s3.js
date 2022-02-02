require("dotenv")
var aws = require("aws-sdk")
var multer = require("multer")
var multerS3 = require("multer-s3")
const { BadRequestError } = require("../_base/error")

var s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: process.env.AWS_DEFAULT_REGION
})

const multerFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new BadRequestError("Invalid file type."))
  }
}

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read-write",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      const userId = req.user._id
      const nowTimeStamp = Date.now().toString()
      const name = `${userId}/${nowTimeStamp}`
      cb(null, name)
    }
  }),
  fileFilter: multerFilter
})

exports.deleteImage = Key => {
  s3.deleteObject({ Bucket: process.env.BUCKET_NAME, Key }, (err, data) => {
    console.log(err, data)
  })
}
