const bcrypt = require("bcrypt");

const hashSync = (password) => {
  return bcrypt.hashSync(password, 10);
};

module.exports = { hashSync };
