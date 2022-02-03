const mongoose = require("mongoose")

const { MongoMemoryServer } = require("mongodb-memory-server")

const mongod = new MongoMemoryServer()

exports.connect = async () => {
  const uri = await mongod.getUri()
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: true
  }
  await mongoose.connect(uri, mongooseOpts)
}

exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}
