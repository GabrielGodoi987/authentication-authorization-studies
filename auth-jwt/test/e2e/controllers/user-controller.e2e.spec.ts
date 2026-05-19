import request from "supertest";
import { app } from "../../../src/app";
import { resetDataSource, getDataSource } from "../../../src/database/source";
import { seedUsers } from "../../../src/database/seeds/user.seed";
import { UserPersistenceEntity } from "../../../src/infrastructure/persistence/user-persistence.entity";

let createdUserId: string;

beforeAll(async () => {
  process.env.DB_PATH = ":memory:";
  resetDataSource();
  const ds = await getDataSource().initialize();
  await ds.synchronize(true);
});

afterAll(async () => {
  const ds = getDataSource();
  if (ds.isInitialized) {
    await ds.destroy();
  }
});

describe("UserController - e2e test", () => {
  beforeEach(async () => {
    const ds = getDataSource();
    const repo = ds.getRepository(UserPersistenceEntity);
    await repo.clear();
  });

  describe("POST /users", () => {
    it("creates a user and returns 201", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john@doe.com", password: "Strong1Pass" });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: "John Doe", email: "john@doe.com" });
      expect(res.body.id).toEqual(expect.any(String));
      createdUserId = res.body.id;
    });

    it("returns 500 when email already exists", async () => {
      await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john@doe.com", password: "Strong1Pass" });

      const res = await request(app)
        .post("/users")
        .send({ name: "Jane Doe", email: "john@doe.com", password: "Strong1Pass" });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ message: "Internal Server Error" });
    });

    it("returns 500 when password is invalid", async () => {
      const res = await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john@doe.com", password: "123" });

      expect(res.status).toBe(500);
    });
  });

  describe("GET /users", () => {
    beforeEach(async () => {
      await seedUsers(getDataSource());
    });

    it("returns all users", async () => {
      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(10);
      expect(res.body[0]).toMatchObject({ name: "User 1", email: "user1@example.com" });
      expect(res.body[0].id).toEqual(expect.any(String));
    });

    it("does not expose passwords", async () => {
      const res = await request(app).get("/users");
      for (const user of res.body) {
        expect(user.password).toBeUndefined();
      }
    });
  });

  describe("GET /users/:id", () => {
    beforeEach(async () => {
      await seedUsers(getDataSource());
    });

    it("returns a user by id", async () => {
      const all = await request(app).get("/users");
      const id = all.body[0].id;

      const res = await request(app).get(`/users/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id, name: "User 1", email: "user1@example.com" });
    });

    it("returns 404 when user not found", async () => {
      const res = await request(app).get("/users/nonexistent-id");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });
  });

  describe("GET /users/search?email=", () => {
    beforeEach(async () => {
      await seedUsers(getDataSource());
    });

    it("returns a user by email", async () => {
      const res = await request(app).get("/users/search?email=user1@example.com");

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "User 1", email: "user1@example.com" });
    });

    it("returns 404 when email not found", async () => {
      const res = await request(app).get("/users/search?email=unknown@test.com");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });

    it("returns 400 when email param is missing", async () => {
      const res = await request(app).get("/users/search");

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ message: "Email query parameter is required" });
    });
  });

  describe("PUT /users/:id", () => {
    beforeEach(async () => {
      await seedUsers(getDataSource());
    });

    it("updates a user and returns 200", async () => {
      const all = await request(app).get("/users");
      const id = all.body[0].id;

      const res = await request(app)
        .put(`/users/${id}`)
        .send({ name: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id, name: "Updated Name", email: "user1@example.com" });
    });

    it("returns 404 when user not found", async () => {
      const res = await request(app)
        .put("/users/nonexistent-id")
        .send({ name: "Updated" });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });
  });

  describe("DELETE /users/:id", () => {
    beforeEach(async () => {
      await seedUsers(getDataSource());
    });

    it("deletes a user and returns 204", async () => {
      const all = await request(app).get("/users");
      const id = all.body[0].id;

      const res = await request(app).delete(`/users/${id}`);

      expect(res.status).toBe(204);
    });

    it("returns 404 when user not found", async () => {
      const res = await request(app).delete("/users/nonexistent-id");

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });
  });
});
