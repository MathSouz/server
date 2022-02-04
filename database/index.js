require("dotenv/config")
const mongoose = require("mongoose")

const connectionString = process.env.DB_CONNECTION_STRING

mongoose.connect(connectionString, { maxPoolSize: 3 }).catch(err => {
  if (err) {
    process.exit(1)
  }
})

module.exports = { mongoose }
