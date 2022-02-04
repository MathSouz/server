const mongoose = require("mongoose")

const { MongoMemoryServer } = require("mongodb-memory-server")

const mongod = MongoMemoryServer.create()
const connect = async () => {
  const instance = await mongod
  const uri = instance.getUri()
  return mongoose.connect(uri)
}

module.exports = { connect }
