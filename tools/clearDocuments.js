const { user, post, comment, report, token } = require("../database/models")

user
  .deleteMany({})
  .then(res => {
    console.log(`Deleted ${res.deletedCount} users.`)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    console.log("Done deleting users.")
  })

post
  .deleteMany({})
  .then(res => {
    console.log(`Deleted ${res.deletedCount} posts.`)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    console.log("Done deleting posts.")
  })

comment
  .deleteMany({})
  .then(res => {
    console.log(`Deleted ${res.deletedCount} comments.`)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    console.log("Done deleting comments.")
  })

report
  .deleteMany({})
  .then(res => {
    console.log(`Deleted ${res.deletedCount} reports.`)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    console.log("Done deleting reports.")
  })

token
  .deleteMany({})
  .then(res => {
    console.log(`Deleted ${res.deletedCount} tokens.`)
  })
  .catch(err => {
    console.log(err)
  })
  .finally(() => {
    console.log("Done deleting tokens.")
  })
