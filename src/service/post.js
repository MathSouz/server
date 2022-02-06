const sanitize = require("mongo-sanitize")
const { isValidObjectId } = require("mongoose")
const { post } = require("../../database/models")
const { VALID_MOODS, roles } = require("../_base/constants")
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../_base/error")
const { deleteImage } = require("./s3")

exports.getPost = async (user, postId) => {
  if (!isValidObjectId(postId)) {
    throw new NotFoundError("Post not found.")
  }

  const foundPost = await post
    .findOne({ _id: postId })
    .populate(["user", "loveReactions", "hateReactions"])
    .lean()

  if (!foundPost) {
    throw new NotFoundError("Post not found.")
  }

  const isOwner = foundPost.user != user._id
  const isAdmin = user.role === roles.ADMIN

  foundPost.canDelete = isOwner || isAdmin

  return foundPost
}

exports.getAllPosts = async (limit, page, sort) => {
  const options = {
    limit,
    page,
    sort: { createdAt: sort },
    populate: ["user", "loveReactions", "hateReactions"]
  }
  return post.paginate({}, options)
}

exports.createPost = async (file, text, user, tags) => {
  const imageUrl = file
    ? {
        location: file.location,
        key: file.key
      }
    : null
  if (!text) {
    return new BadRequestError("No text.")
  }

  if (!tags) {
    tags = []
  }

  if (!Array.isArray(tags)) {
    tags = [tags]
  }

  tags = tags.map(v => v.toLowerCase())

  return post.create({
    user,
    text,
    imageUrl,
    tags
  })
}

exports.reactPost = async (user, targetPost, mood) => {
  if (!VALID_MOODS.includes(mood)) {
    throw new BadRequestError("Invalid Mood.")
  }

  if (!isValidObjectId(targetPost._id)) {
    throw new BadRequestError("Invalid post id.")
  }

  const foundPost = await post.findById(targetPost._id)

  if (!foundPost) {
    throw new NotFoundError("Post not found.")
  }

  if (mood !== VALID_MOODS[0]) {
    if (mood === VALID_MOODS[1]) {
      await post.findByIdAndUpdate(
        targetPost._id,
        {
          $addToSet: { loveReactions: user._id },
          $pull: { hateReactions: user._id }
        },
        { new: true }
      )
    } else {
      await post.findByIdAndUpdate(
        targetPost._id,
        {
          $addToSet: { hateReactions: user._id },
          $pull: { loveReactions: user._id }
        },
        { new: true }
      )
    }
  } else {
    await post.findByIdAndUpdate(
      targetPost._id,
      {
        $pull: { hateReactions: user._id, loveReactions: user._id }
      },
      { new: true }
    )
  }
}

exports.deletePost = async (user, currentPost) => {
  if (!isValidObjectId(currentPost._id)) {
    throw new BadRequestError("Invalid post id.")
  }

  const foundPost = await post.findById(currentPost._id)

  if (!foundPost) {
    throw new NotFoundError("Post not found.")
  }

  const isOwner = foundPost.user != user._id
  const isAdmin = user.role === roles.ADMIN

  if (!isOwner && !isAdmin) {
    throw new UnauthorizedError("You don't have permission.")
  }

  const deleted = await foundPost.remove()

  if (foundPost.imageUrl) {
    deleteImage(deleted.imageUrl.key)
  }
}

exports.getRankedPosts = async (limit, page) => {
  const options = { limit, page }

  const from = new Date()
  from.setHours(0)
  from.setMinutes(0)
  from.setSeconds(0)

  const to = new Date()
  to.setDate(to.getDate() + 1)
  to.setHours(0)
  to.setMinutes(0)
  to.setSeconds(0)

  const query = [
    {
      $match: {
        createdAt: {
          $gte: new Date("Wed, 02 Feb 2022 03:00:00 GMT")
        }
      }
    },
    {
      $project: {
        user: "$user",
        loveReactions: "$loveReactions",
        hateReactions: "$hateReactions",
        loveReactionsCount: {
          $size: "$loveReactions"
        },
        hateReactionsCount: {
          $size: "$hateReactions"
        },
        tags: "$tags",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt"
      }
    },
    {
      $sort: {
        upvotes: -1
      }
    }
  ]

  const aggregation = post.aggregate(query)

  return post.aggregatePaginate(aggregation, options)
}
