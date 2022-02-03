const bcrypt = require("bcrypt")

exports.hashSync = password => {
  return bcrypt.hashSync(password, 10)
}

exports.compareSync = (password, encryptedPassword) => {
  return bcrypt.compareSync(password, encryptedPassword)
}
