import request from "supertest";
import { app } from "../../../src/app";
import { getDataSource, resetDataSource } from "../../../src/database/source";
import { ProductPersistenceEntity } from "../../../src/infrastructure/persistence/product-persistence.entity";
import { context } from "../../helpers/context";

const API_TOKEN = "Jesus_is_my_savior";

describe("ProductController - e2e test", () => {
  beforeAll(async () => {
    process.env.DB_PATH = ":memory:";
    resetDataSource();
    const ds = await getDataSource().initialize();
    await ds.synchronize(true);
  });

  beforeEach(async () => {
    const ds = getDataSource();
    const repo = ds.getRepository(ProductPersistenceEntity);
    await repo.clear();
  });

  afterAll(async () => {
    const ds = getDataSource();
    if (ds.isInitialized) {
      await ds.destroy();
    }
  });

  context("find", () => {
    it("should return all products with status 200", async () => {
      await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "Product 1", price: 100 })
        .expect(201);

      const res = await request(app)
        .get("/products")
        .set("x-api-token", API_TOKEN);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ name: "Product 1", price: 100 });
    });

    it("should return empty array when no products exist", async () => {
      const res = await request(app)
        .get("/products")
        .set("x-api-token", API_TOKEN);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return a product by id with status 200", async () => {
      const created = await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "Product 1", price: 100 })
        .expect(201);

      const res = await request(app)
        .get(`/products/${created.body.id}`)
        .set("x-api-token", API_TOKEN);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: created.body.id,
        name: "Product 1",
        price: 100,
      });
    });

    it("should return 500 when product is not found", async () => {
      const res = await request(app)
        .get("/products/nonexistent-id")
        .set("x-api-token", API_TOKEN);

      expect(res.status).toBe(500);
    });
  });

  context("create", () => {
    it("should create a product and return 201", async () => {
      const res = await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "New Product", price: 50 });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: "New Product", price: 50 });
      expect(res.body.id).toEqual(expect.any(String));
    });

    it("should return 500 when name is empty", async () => {
      const res = await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "", price: 50 });

      expect(res.status).toBe(500);
    });

    it("should return 500 when price is negative", async () => {
      const res = await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "Product", price: -1 });

      expect(res.status).toBe(500);
    });
  });

  context("update", () => {
    it("should update a product and return 200", async () => {
      const created = await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "Old Name", price: 50 })
        .expect(201);

      const res = await request(app)
        .put(`/products/${created.body.id}`)
        .set("x-api-token", API_TOKEN)
        .send({ name: "New Name", price: 100 });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "New Name", price: 100 });
    });

    it("should return 500 when product is not found", async () => {
      const res = await request(app)
        .put("/products/nonexistent-id")
        .set("x-api-token", API_TOKEN)
        .send({ name: "Updated", price: 10 });

      expect(res.status).toBe(500);
    });
  });

  context("delete", () => {
    it("should delete a product and return 204", async () => {
      const created = await request(app)
        .post("/products")
        .set("x-api-token", API_TOKEN)
        .send({ name: "To Delete", price: 30 })
        .expect(201);

      const res = await request(app)
        .delete(`/products/${created.body.id}`)
        .set("x-api-token", API_TOKEN);

      expect(res.status).toBe(204);
    });

    it("should return 204 when product is not found", async () => {
      const res = await request(app)
        .delete("/products/nonexistent-id")
        .set("x-api-token", API_TOKEN);

      expect(res.status).toBe(204);
    });
  });
});
