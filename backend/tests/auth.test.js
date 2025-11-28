const request = require("supertest");
const app = require("../src/app");
const { _users } = require("../src/controllers/authController");

describe("Auth flows", () => {
    beforeEach(() => {
        _users.length = 0;
    });

    test("register -> login -> protected upload rejected without file", async () => {
        const agent = request(app);
        await agent
            .post("/api/auth/register")
            .send({ username: "u1", password: "p" })
            .expect(201);
        const login = await agent
            .post("/api/auth/login")
            .send({ username: "u1", password: "p" })
            .expect(200);
        const token = login.body.token;
        await agent
            .post("/api/upload")
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });
});
