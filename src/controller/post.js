const { isValidObjectId } = require("mongoose");
const { post } = require("../database/models/post");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../_base/error");

exports.getPost = async (req, res, next) => {
  const user = req.user;
  const { postId } = req.params;

  try {
    if (!isValidObjectId(postId)) {
      throw new NotFoundError("Post not found.");
    }

    const foundPost = await post
      .findOne({ _id: postId })
      .populate("user", ["-following"]);

    if (!user.following.includes(foundPost.user._id)) {
      throw new ForbiddenError("You don't have permission.");
    }

    if (!foundPost) {
      throw new NotFoundError("Post not found.");
    }

    return res.json(foundPost);
  } catch (err) {
    return next(err);
  }
};

exports.getPublicPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    if (!isValidObjectId(postId)) {
      throw new NotFoundError("Post not found.");
    }

    const foundPost = await post
      .findOne({ _id: postId, private: false })
      .populate("user", ["-following"]);

    if (!foundPost) {
      throw new NotFoundError("Post not found.");
    }

    return res.json(foundPost);
  } catch (err) {
    return next(err);
  }
};

exports.getRecentPosts = async (req, res, next) => {
  const maxLimit = 10;
  const { limit = maxLimit, page = 1 } = req.query;
  const query = { private: false };
  const options = {
    sort: "-createdAt",
    limit,
    page,
    populate: [{ path: "user", select: ["-following"] }],
  };

  try {
    if (limit > maxLimit) {
      throw new BadRequestError(`Limit too high! Max.: ${maxLimit}.`);
    }

    const posts = await post.paginate(query, options);
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
};

exports.getUserRecentPosts = async (req, res, next) => {
  const { _id, following } = req.user;
  const { targetUserId } = req.params;
  const maxLimit = 10;
  const { limit = maxLimit, page = 1 } = req.query;
  let query = { user: targetUserId };

  if (!following.includes(targetUserId)) {
    query = { user: targetUserId, private: false };
  }

  const options = {
    sort: "-createdAt",
    limit,
    page,
    populate: [{ path: "user", select: ["-following"] }],
  };

  try {
    if (_id == targetUserId) {
      throw new ForbiddenError("Use another endpoint to see own posts.");
    }

    if (limit > maxLimit) {
      throw new BadRequestError(`Limit too high! Max.: ${maxLimit}.`);
    }

    const posts = await post.paginate(query, options);
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
};

exports.getMyRecentPosts = async (req, res, next) => {
  const { _id } = req.user;

  const maxLimit = 10;
  const { limit = maxLimit, page = 1 } = req.query;

  const query = { user: _id };
  const options = {
    sort: "-createdAt",
    limit,
    page,
    populate: [{ path: "user", select: ["-following"] }],
  };

  try {
    if (limit > maxLimit) {
      throw new BadRequestError(`Limit too high! Max.: ${maxLimit}.`);
    }
    const posts = await post.paginate(query, options);
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const user = req.user;
  const { text, imageUrl, private } = req.body;

  try {
    if (!text) {
      return new BadRequestError("No text.");
    }

    const createdPost = await post.create({
      user: user.id,
      text,
      imageUrl,
      private,
    });
    return res.json({ post: createdPost });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
