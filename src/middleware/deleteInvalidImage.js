const { deleteImage } = require("../service/s3")
const { BadRequestError } = require("../_base/error")

module.exports = maxSize => (req, res, next) => {
  const { size, key } = req.file

  try {
    if (size > maxSize) {
      deleteImage(key)
      const oneMegabyte = 1024
      const maxSizeinMega = (maxSize / oneMegabyte).toFixed(1)
      const sizeinMega = (size / oneMegabyte).toFixed(1)
      throw new BadRequestError(
        `Image too large. Max.: ${maxSizeinMega} MBs. Requested.: ${sizeinMega} MBs.`
      )
    }

    next()
  } catch (err) {
    return next(err)
  }
}
