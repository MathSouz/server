const { sign, revoke } = require("../service/token")

exports.generateToken = async userId => {
  try {
    const generatedToken = await sign(userId)
    return generatedToken
  } catch (err) {
    throw err
  }
}

exports.revokeToken = async theToken => {
  try {
    return await revoke(theToken)
  } catch (err) {
    throw err
  }
}

exports.verifyToken = async theToken => {
  try {
    const userToken = await this.verifyToken(theToken)
    return userToken
  } catch (err) {
    throw err
  }
}
