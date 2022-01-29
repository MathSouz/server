require("dotenv/config");
const mongoose = require("mongoose");

const connectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(connectionString, (err) => {
  if (err) {
    console.log("Unable to connect to database. Closing...");
    process.exit(1);
  }

  console.log("Database connection estabilished!");
});

module.exports = { mongoose };
