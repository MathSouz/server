const { user } = require("../database/models/user");
const { verify } = require("../service/jwt");

const isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(404).json({ message: "Token not found" });
  }

  const authorizationToken = authorization.split(" ");

  if (authorizationToken.length != 2) {
    return res.status(400).json({ message: "Bad format token" });
  }

  if (authorizationToken[0] !== "Bearer") {
    return res.status(400).json({ message: "Bad format token" });
  }

  const token = authorizationToken[1];

  try {
    const { id } = verify(token);
    const userFound = await user.findById(id);

    req.user = userFound;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { isAuthenticated };
