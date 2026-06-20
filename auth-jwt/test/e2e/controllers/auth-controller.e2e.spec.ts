import request from "supertest";
import { app } from "../../../src/app";
import { resetDataSource, getDataSource } from "../../../src/database/source";
import { UserPersistenceEntity } from "../../../src/infrastructure/persistence/user-persistence.entity";

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

describe("AuthController - e2e test", () => {
  describe("POST /auth/login", () => {
    beforeEach(async () => {
      const ds = getDataSource();
      const repo = ds.getRepository(UserPersistenceEntity);
      await repo.clear();
    });

    it("should return 200 and a token when credentials are valid", async () => {
      await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john@doe.com", password: "Strong1Pass" })
        .expect(201);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "john@doe.com", password: "Strong1Pass" });

      expect(res.status).toBe(200);
      expect(res.body.use).toMatchObject({ name: "John Doe", email: "john@doe.com" });
      expect(res.body.token).toEqual(expect.any(String));
    });

    it("should return 500 when email does not exist", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "unknown@doe.com", password: "Strong1Pass" });

      expect(res.status).toBe(500);
    });

    it("should return 500 when password is wrong", async () => {
      await request(app)
        .post("/users")
        .send({ name: "John Doe", email: "john@doe.com", password: "Strong1Pass" })
        .expect(201);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "john@doe.com", password: "wrong-password" });

      expect(res.status).toBe(500);
    });
  });
});
