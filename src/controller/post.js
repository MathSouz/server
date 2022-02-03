const {
  getPost,
  getAllPosts,
  createPost,
  reactPost,
  deletePost,
  getRankedPosts
} = require("../service/post")
const { httpStatusCodes } = require("../_base/constants")

exports.getPost = async (req, res, next) => {
  const { postId } = req.params

  try {
    const foundPost = await getPost(postId)
    return res.json(foundPost)
  } catch (err) {
    return next(err)
  }
}

exports.reactPost = async (req, res, next) => {
  const user = req.user
  const { postId } = req.params
  const { mood } = req.body
  const post = { _id: postId }

  try {
    await reactPost(user, post, mood)
    return res.json({ mood })
  } catch (err) {
    return next(err)
  }
}

exports.deletePost = async (req, res, next) => {
  const user = req.user
  const { postId } = req.params
  const post = { _id: postId }
  try {
    await deletePost(user, post)
    return res.sendStatus(httpStatusCodes.OK)
  } catch (err) {
    return next(err)
  }
}

exports.getAllPosts = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.pagination
  const { sort = "desc" } = req.query

  try {
    const foundPosts = await getAllPosts(limit, page, sort)
    return res.json(foundPosts)
  } catch (err) {
    return next(err)
  }
}

exports.getRankedPosts = async (req, res, next) => {
  const { limit = 10, page = 1 } = req.pagination

  try {
    const posts = await getRankedPosts(limit, page)
    return res.json(posts)
  } catch (err) {
    return next(err)
  }
}

exports.createPost = async (req, res, next) => {
  const user = req.user
  let { text, tags } = req.body
  const part = req.file

  try {
    const createdPost = await createPost(part, text, user, tags)
    return res.json(createdPost)
  } catch (err) {
    console.log(err)
    return next(err)
  }
}
