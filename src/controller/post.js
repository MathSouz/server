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

    if (
      !user.following.includes(foundPost.user._id) &&
      user._id !== foundPost.user._id
    ) {
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

exports.getTags = async (req, res, next) => {
  const { q, limit } = req.query;
  const result = await post.find();
  const tags = result
    .map((post) => post.tags)
    .filter((tagArray) => tagArray.length > 0)
    .reduce((pV, cV) => {
      return [...pV, ...cV];
    }, [])
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter((v) => {
      return q ? v.startsWith(q) : true;
    });
  if (limit > 0) {
    tags.length = limit;
  }

  return res.json(tags);
};

exports.getTagsWithOccurrences = async (req, res, next) => {
  const { q, sort = "desc" } = req.query;
  const result = await post.find();
  const tags = result
    .map((post) => post.tags)
    .filter((tagArray) => tagArray.length > 0)
    .reduce((pV, cV) => {
      return [...pV, ...cV];
    }, [])
    .reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});

  const keys = Object.keys(tags)
    .map((v) => {
      return { tag: v, occurrences: tags[v] };
    })
    .filter((v) => {
      return q ? v.tag.startsWith(q) : true;
    })
    .sort((a, b) => {
      if (sort === "asc") {
        return a.occurrences - b.occurrences;
      } else {
        return b.occurrences - a.occurrences;
      }
    });

  return res.json(keys);
};

exports.createPost = async (req, res, next) => {
  const user = req.user;
  let { text, imageUrl, private, tags } = req.body;
  user.following = undefined;

  try {
    if (!text) {
      return new BadRequestError("No text.");
    }

    if (!tags) {
      tags = [];
    }

    tags = tags.map((v) => v.toLowerCase());

    const createdPost = await post.create({
      user,
      text,
      imageUrl,
      private,
      tags,
    });
    return res.json(createdPost);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
