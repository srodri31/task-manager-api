const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const { user1Id, user1, setupDB } = require("./fixtures/db")

beforeEach(setupDB)

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Santiago Test",
            email: "santiago.rp@globant.com",
            password: "pasw1234!"
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: "Santiago Test",
            email: "santiago.rp@globant.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe("pasw1234!")
})

test("Should login existing user", async() => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: user1.email,
            password: user1.password
        })
        .expect(200)

    const user = await User.findById(user1._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login nonexistent user", async() => {
    await request(app)
        .post("/users/login")
        .send({
            email: "lies@co.co"
        })
        expect(400)
})

test("Should get user profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get profile for non authenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should delete account user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user =await User.findById(user1._id)
    expect(user).toBeNull()
})

test("Should not delete account user for unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200)

    const user = await User.findById(user1._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
    await request(app)
        .put("/users/me")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send({
            name: "Andrew"
        })
        .expect(200)

    const user = await User.findById(user1._id)
    expect(user.name).toEqual("Andrew")
})

test("Should not update invalid users fields", async () => {
    await request(app)
        .put("/users/me")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send({
            location: "Medallo"
        })
        .expect(400)
})