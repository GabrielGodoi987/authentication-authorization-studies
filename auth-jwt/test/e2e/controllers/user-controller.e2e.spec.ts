import request from "supertest";
import { app } from "../../../src/app";
import { seedUsers } from "../../../src/database/seeds/user.seed";
import { getDataSource, resetDataSource } from "../../../src/database/source";
import { UserPersistenceEntity } from "../../../src/infrastructure/persistence/user-persistence.entity";

describe("UserController - e2e test", () => {
  beforeAll(async () => {
    process.env.DB_PATH = ":memory:";
    resetDataSource();
    const ds = await getDataSource().initialize();
    await ds.synchronize(true);
  });

  beforeEach(async () => {
    const ds = getDataSource();
    const repo = ds.getRepository(UserPersistenceEntity);
    await repo.clear();
  });

  afterAll(async () => {
    const ds = getDataSource();
    if (ds.isInitialized) {
      await ds.destroy();
    }
  });

  describe("POST /users", () => {
    it("should create a user and return 201", async () => {
      const res = await request(app).post("/users").send({
        name: "John Doe",
        email: "john@doe.com",
        password: "Strong1Pass",
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: "John Doe",
        email: "john@doe.com",
      });
      expect(res.body.id).toEqual(expect.any(String));
    });

    it("should return 500 when email already exists", async () => {
      await request(app).post("/users").send({
        name: "John Doe",
        email: "john@doe.com",
        password: "Strong1Pass",
      });

      const res = await request(app).post("/users").send({
        name: "Jane Doe",
        email: "john@doe.com",
        password: "Strong1Pass",
      });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ message: "Internal Server Error" });
    });

    it("should return 500 when password is invalid", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john@doe.com", password: "123" });

      expect(res.status).toBe(500);
    });
  });

  describe("GET /users", () => {
    beforeEach(async () => {
      await seedUsers();
    });

    it("should return all users", async () => {
      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(10);
      expect(res.body[0]).toMatchObject({
        name: "User 1",
        email: "user1@example.com",
      });
      expect(res.body[0].id).toEqual(expect.any(String));
    });

    it("should not expose passwords", async () => {
      const res = await request(app).get("/users");
      for (const user of res.body) {
        expect(user.password).toBeUndefined();
      }
    });
  });

  describe("GET /users/:id", () => {
    beforeEach(async () => {
      await seedUsers();
    });

    it("should return a user by id", async () => {
      const all = await request(app).get("/users");
      const id = all.body[0].id;

      const res = await request(app).get(`/users/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id,
        name: "User 1",
        email: "user1@example.com",
      });
    });

    it("should return 404 when user not found", async () => {
      const res = await request(app).get("/users/nonexistent-id");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });
  });

  describe("GET /users/search?email=", () => {
    beforeEach(async () => {
      await seedUsers();
    });

    it("should return a user by email", async () => {
      const res = await request(app).get(
        "/users/search?email=user1@example.com",
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: "User 1",
        email: "user1@example.com",
      });
    });

    it("should return 404 when email not found", async () => {
      const res = await request(app).get(
        "/users/search?email=unknown@test.com",
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });

    it("should return 400 when email param is missing", async () => {
      const res = await request(app).get("/users/search");

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: "Email query parameter is required",
      });
    });
  });

  describe("PUT /users/:id", () => {
    beforeEach(async () => {
      await seedUsers();
    });

    it("should update a user and return 200", async () => {
      const all = await request(app).get("/users");
      const id = all.body[0].id;

      const res = await request(app)
        .put(`/users/${id}`)
        .send({ name: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id,
        name: "Updated Name",
        email: "user1@example.com",
      });
    });

    it("should return 404 when user not found", async () => {
      const res = await request(app)
        .put("/users/nonexistent-id")
        .send({ name: "Updated" });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });
  });

  describe("DELETE /users/:id", () => {
    beforeEach(async () => {
      await seedUsers();
    });

    it("should delete a user and return 204", async () => {
      const all = await request(app).get("/users");
      const id = all.body[0].id;

      const res = await request(app).delete(`/users/${id}`);

      expect(res.status).toBe(204);
    });

    it("should return 404 when user not found", async () => {
      const res = await request(app).delete("/users/nonexistent-id");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });
  });
});
