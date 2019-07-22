const request = require("supertest")
const app = require("../src/app")
const Task = require("../src/models/task")
const { 
    user1,
    user2, 
    task1, 
    task2,
    task3,
    setupDB 
} = require("./fixtures/db")

beforeEach(setupDB)

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send({
            description: "My test task"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test("Should return user tasks", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test("Should delete user task", async () => {
    await request(app)
        .delete(`/tasks/${task1._id}`)
        .set("Authorization", `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404)
})