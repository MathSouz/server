const { user } = require("../database/models")
const { loginUser } = require("../src/service/user")
const { compareSync } = require("../src/service/bcrypt")

describe("user tests", () => {
  it("register user successfully", async () => {
    user.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockImplementationOnce(() => ({
          select: jest.fn().mockResolvedValueOnce({})
        }))
      }))
    }))

    const login = await loginUser("email@email.com", "password")
    expect(login).toBe(true)
  })
})
