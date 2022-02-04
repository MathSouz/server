require("dotenv/config")
const mongoose = require("mongoose")

const connectionString = process.env.DB_CONNECTION_STRING

mongoose
  .connect(connectionString, { maxPoolSize: 3 })
  .then(res => {
    console.log("Database connection estabilished!")
  })
  .catch(err => {
    if (err) {
      console.log("Unable to connect to database. Closing...")
      process.exit(1)
    }
  })

module.exports = { mongoose }
