const { post } = require("../database/models/post");

exports.getRecentPosts = async (req, res) => {
  const maxLimit = 10;
  const { limit = maxLimit, page = 1 } = req.query;

  if (limit > maxLimit) {
    return res
      .status(400)
      .json({ message: `Limit too high! Max.: ${maxLimit}` });
  }

  const query = { private: false };
  const options = {
    sort: "-createdAt",
    limit,
    page,
    populate: [{ path: "user", select: ["-following"] }],
  };
  const posts = await post.paginate(query, options);
  return res.json(posts);
};

exports.getUserRecentPosts = async (req, res) => {
  const { _id } = req.user;
  const { targetUserId } = req.params;

  if (_id == targetUserId) {
    return res
      .status(400)
      .json({ message: "Use another endpoint to see own posts" });
  }

  const maxLimit = 10;
  const { limit = maxLimit, page = 1 } = req.query;

  if (limit > maxLimit) {
    return res
      .status(400)
      .json({ message: `Limit too high! Max.: ${maxLimit}` });
  }

  const query = { user: targetUserId, private: false };
  const options = {
    sort: "-createdAt",
    limit,
    page,
    populate: [{ path: "user", select: ["-following"] }],
  };

  try {
    const posts = await post.paginate(query, options);
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Impossible to fetch data..." });
  }
};

exports.getMyRecentPosts = async (req, res) => {
  const { _id } = req.user;

  const maxLimit = 10;
  const { limit = maxLimit, page = 1 } = req.query;

  if (limit > maxLimit) {
    return res
      .status(400)
      .json({ message: `Limit too high! Max.: ${maxLimit}` });
  }

  const query = { user: _id };
  const options = {
    sort: "-createdAt",
    limit,
    page,
    populate: [{ path: "user", select: ["-following"] }],
  };

  const posts = await post.paginate(query, options);
  return res.json(posts);
};

exports.createPost = async (req, res) => {
  const user = req.user;

  const { text, imageUrl, private } = req.body;

  if (!text) {
    return res.status(400).json({ message: "No text" });
  }

  try {
    const createdPost = await post.create({
      user: user.id,
      text,
      imageUrl,
      private,
    });
    return res.json({ post: createdPost });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred" });
  }
};
