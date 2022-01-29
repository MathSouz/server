const { user } = require("../database/models/user");
const { hashSync } = require("../service/bcrypt");
const { httpStatusCodes, roles } = require("../_base/constants");
const bcrypt = require("bcrypt");
const { sign } = require("../service/jwt");
const {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  NotFoundError,
} = require("../_base/error/");
const BaseError = require("../_base/error/baseError");

exports.me = (req, res) => {
  return res.json({ user: req.user });
};

exports.changeUsername = async (req, res, next) => {
  const { username } = req.body;
  const { id } = req.user;

  try {
    if (!username) {
      throw new BadRequestError("No username.");
    }

    const update = await user.updateOne({ _id: id }, { username });
    if (update.modifiedCount) {
      return res.sendStatus(200);
    } else {
      throw new ForbiddenError("Your username didn't changed");
    }
  } catch (err) {
    return next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { password } = req.body;
  const { id } = req.user;

  try {
    if (!password) {
      throw new BadRequestError("No password.");
    }

    const encryptedPassword = hashSync(password);
    const update = await user.updateOne(
      { _id: id },
      { password: encryptedPassword }
    );

    if (update.modifiedCount) {
      return res.sendStatus(200);
    } else {
      throw new ForbiddenError("Your password didn't changed");
    }
  } catch (err) {
    return next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  const { role } = req.user;
  const { targetId } = req.params;
  const { newRole } = req.body;

  try {
    if (!newRole) {
      throw new BadRequestError("No role declared.");
    }

    const selectedRole = roles[newRole];

    if (!selectedRole) {
      throw new BadRequestError("Invalid role.");
    }

    if (!targetId) {
      throw new BadRequestError("No target user id.");
    }

    if (role !== roles.ADMIN) {
      throw new UnauthorizedError("You are not allowed to do that.");
    }
    const update = await user.updateOne(
      { _id: targetId },
      { role: selectedRole }
    );

    if (update.modifiedCount) {
      return res.sendStatus(200);
    } else {
      throw new ForbiddenError("You already have this role.");
    }
  } catch (err) {
    return next(err);
  }
};

exports.followUser = async (req, res, next) => {
  const { _id } = req.user;
  const { targetUserId } = req.params;

  try {
    if (_id == targetUserId) {
      throw new BadRequestError("Cannot follow yourself.");
    }
    const update = await user.updateOne(
      { _id },
      { $addToSet: { following: targetUserId } }
    );

    if (update.modifiedCount > 0) {
      return res.sendStatus(200);
    } else {
      throw new ForbiddenError("You are already following this user.");
    }
  } catch (err) {
    return next(err);
  }
};

exports.unfollowUser = async (req, res, next) => {
  const { _id } = req.user;
  const { targetUserId } = req.params;

  try {
    const update = await user.updateOne(
      { _id },
      { $pull: { following: targetUserId } }
    );

    if (update.modifiedCount) {
      return res.sendStatus(httpStatusCodes.OK);
    } else {
      throw new NotFoundError("You are not following this user.");
    }
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      throw new BadRequestError("No email.");
    }

    if (!password) {
      throw new BadRequestError("No password.");
    }

    const foundUser = await user
      .findOne({ email })
      .select("+password")
      .select("+email");

    if (!foundUser) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const token = sign({ id: foundUser._id });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    console.log(req.body);
    if (!username) {
      throw new BadRequestError("No username.");
    }

    if (!email) {
      throw new BadRequestError("No email.");
    }

    if (!password) {
      throw new BadRequestError("No password.");
    }

    const createdUser = await user.create({ username, email, password });
    createdUser.password = undefined;
    const token = sign({ id: createdUser._id });

    return res.json({ createdUser: user, token });
  } catch (err) {
    if (err instanceof BaseError) {
      return next(err);
    } else {
      return next(new ForbiddenError("User already exists."));
    }
  }
};
