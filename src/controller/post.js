const { isValidObjectId } = require("mongoose")
const { post } = require("../database/models/post")
const { upload, deleteImage } = require("../service/s3")
const {
  httpStatusCodes,
  VALID_MOODS,
  models,
  roles
} = require("../_base/constants")
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../_base/error")

exports.getPost = async (req, res, next) => {
  const { postId } = req.params

  try {
    if (!isValidObjectId(postId)) {
      throw new NotFoundError("Post not found.")
    }

    const foundPost = await post.findOne({ _id: postId }).populate("user")

    if (!foundPost) {
      throw new NotFoundError("Post not found.")
    }
    return res.json(foundPost)
  } catch (err) {
    return next(err)
  }
}

exports.reactPost = async (req, res, next) => {
  const user = req.user
  const { postId } = req.params
  const { mood } = req.body

  try {
    if (!VALID_MOODS.includes(mood)) {
      throw new BadRequestError("Invalid Mood.")
    }

    if (!isValidObjectId(postId)) {
      throw new BadRequestError("Invalid post id.")
    }

    const foundPost = await post.findById(postId)

    if (!foundPost) {
      throw new NotFoundError("Post not found.")
    }

    if (mood !== VALID_MOODS[0]) {
      if (mood === VALID_MOODS[1]) {
        await post.findOneAndUpdate(
          { _id: postId },
          {
            $addToSet: { loveReactions: user._id },
            $pull: { hateReactions: user._id }
          },
          { new: true }
        )
      } else {
        await post.findOneAndUpdate(
          { _id: postId },
          {
            $addToSet: { hateReactions: user._id },
            $pull: { loveReactions: user._id }
          },
          { new: true }
        )
      }
    } else {
      await post.findOneAndUpdate(
        { _id: postId },
        {
          $pull: { hateReactions: user._id },
          $pull: { loveReactions: user._id }
        },
        { new: true }
      )
    }
    return res.json({ mood })
  } catch (err) {
    return next(err)
  }
}

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params
  try {
    if (!isValidObjectId(postId)) {
      throw new BadRequestError("Invalid post id.")
    }

    const foundPost = await post.findById(postId)

    const user = req.user

    if (foundPost.user != user._id && user.role !== roles.ADMIN) {
      throw new UnauthorizedError("You don't have permission.")
    }

    if (foundPost) {
      const deleted = await foundPost.remove()

      if (foundPost.imageUrl) {
        deleteImage(deleted.imageUrl.key)
      }

      return res.sendStatus(httpStatusCodes.OK)
    } else {
      throw new NotFoundError("Post not found.")
    }
  } catch (err) {
    return next(err)
  }
}

exports.getAllPosts = async (req, res, next) => {
  const { limit = 10, page = 1, sort = "desc" } = req.query

  try {
    const options = { limit, page, sort: { createdAt: sort } }

    const posts = await post.paginate({}, options)
    return res.json(posts)
  } catch (err) {
    return next(err)
  }
}

exports.getRankedPosts = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query

  try {
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

    const posts = await post.aggregatePaginate(aggregation, options)

    return res.json(posts)
  } catch (err) {
    return next(err)
  }
}

exports.getTags = async (req, res, next) => {
  const { q, limit } = req.query
  const result = await post.find()
  const tags = result
    .map(post => post.tags)
    .filter(tagArray => tagArray.length > 0)
    .reduce((pV, cV) => {
      return [...pV, ...cV]
    }, [])
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter(v => {
      return q ? v.startsWith(q) : true
    })
  if (limit > 0) {
    tags.length = limit
  }

  return res.json(tags)
}

exports.createPost = async (req, res, next) => {
  const user = req.user
  let { text, tags } = req.body
  const part = req.file
  const imageUrl = part
    ? {
        location: part.location,
        key: part.key
      }
    : null

  try {
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

    const createdPost = await post.create({
      user,
      text,
      imageUrl,
      tags
    })
    return res.json(createdPost)
  } catch (err) {
    console.log(err)
    return next(err)
  }
}
