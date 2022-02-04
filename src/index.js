require("dotenv/config")
const express = require("express")
const cors = require("cors")
const app = express()

const publicUserRouter = require("./routes/public/user")
const privateUserRouter = require("./routes/private/user")
const privatePostRouter = require("./routes/private/post")
const privateReportRouter = require("./routes/private/report")

const BaseError = require("./_base/error/baseError")
const { httpStatusCodes } = require("./_base/constants")

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server running at ${port}`)
})

app.use(cors())
app.use(express.json())

app.use("/public/user", publicUserRouter)
app.use("/private/user", privateUserRouter)
app.use("/private/post", privatePostRouter)
app.use("/private/report", privateReportRouter)

app.use(function (err, req, res, next) {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({ message: err.name || err.message })
  } else {
    res
      .status(httpStatusCodes.INTERNAL_SERVER)
      .json({ message: "An unexpected error occurred..." })
  }
  next()
})
