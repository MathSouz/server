const { createComment } = require("../src/service/comment")
const db = require("./db")
beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())

describe(" test comments ", () => {
  it("Create Comment", async done => {
    await expect(createComment("123", "123", null)).rejects.toThrow()
    done()
  })
})
