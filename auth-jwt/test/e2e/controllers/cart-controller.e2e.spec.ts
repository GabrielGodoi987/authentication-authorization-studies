import request from "supertest";
import { app } from "../../../src/app";
import { getDataSource, resetDataSource } from "../../../src/database/source";
import { CartItemsPersistenceEntity } from "../../../src/infrastructure/persistence/cart-items-persistence.entity";
import { CartPersistenceEntity } from "../../../src/infrastructure/persistence/cart-persistence.entity";
import { UserPersistenceEntity } from "../../../src/infrastructure/persistence/user-persistence.entity";
import { context } from "../../helpers/context";

const API_TOKEN = "Jesus_is_my_savior";
const USER_EMAIL = "test@example.com";
const USER_PASSWORD = "Test1234";

async function seedUser(): Promise<string> {
  const ds = getDataSource();
  const repo = ds.getRepository(UserPersistenceEntity);
  const user = new UserPersistenceEntity();
  user.name = "Test User";
  user.email = USER_EMAIL;
  user.password = USER_PASSWORD;
  const saved = await repo.save(user);
  return saved.id;
}

async function login(): Promise<string> {
  const res = await request(app)
    .post("/auth/login")
    .set("x-api-token", API_TOKEN)
    .send({ email: USER_EMAIL, password: USER_PASSWORD });

  return res.body.accessToken;
}

describe("CartController - e2e test", () => {
  let token: string;

  beforeAll(async () => {
    process.env.DB_PATH = ":memory:";
    resetDataSource();
    const ds = await getDataSource().initialize();
    await ds.synchronize(true);
  });

  beforeEach(async () => {
    const ds = getDataSource();
    await ds.getRepository(CartItemsPersistenceEntity).clear();
    await ds.getRepository(CartPersistenceEntity).clear();
    await ds.getRepository(UserPersistenceEntity).clear();

    await seedUser();
    token = await login();
  });

  afterAll(async () => {
    const ds = getDataSource();
    if (ds.isInitialized) {
      await ds.destroy();
    }
  });

  context("create", () => {
    it("should create a cart and return 201", async () => {
      const res = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        price: 0,
        products: [],
      });
      expect(res.body.id).toEqual(expect.any(String));
      expect(res.body.userId).toEqual(expect.any(String));
    });

    it("should return existing cart when user already has one", async () => {
      const first = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const second = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(second.status).toBe(201);
      expect(second.body.id).toBe(first.body.id);
    });
  });

  context("find", () => {
    it("should find cart by user id with status 200", async () => {
      await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const res = await request(app)
        .get("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        price: 0,
        products: [],
      });
      expect(res.body.id).toEqual(expect.any(String));
    });

    it("should return 404 when user has no cart", async () => {
      const res = await request(app)
        .get("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "Cart not found" });
    });

    it("should find cart by id with status 200", async () => {
      const created = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const res = await request(app)
        .get(`/carts/${created.body.id}`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
      expect(res.body).toMatchObject({
        price: 0,
        products: [],
      });
    });

    it("should return 500 when cart id does not exist", async () => {
      const res = await request(app)
        .get("/carts/nonexistent-id")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(500);
    });
  });

  context("add product", () => {
    it("should add a product to the cart and return 200", async () => {
      const cart = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const res = await request(app)
        .post(`/carts/${cart.body.id}/products`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .send({
          productId: "prod-1",
          productName: "Product 1",
          quantity: 2,
          price: 50,
        });

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0]).toMatchObject({
        productId: "prod-1",
        quantity: 2,
        value: 100,
      });
      expect(res.body.price).toBe(100);
    });

    it("should increase quantity when adding same product twice", async () => {
      const cart = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      await request(app)
        .post(`/carts/${cart.body.id}/products`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .send({ productId: "prod-1", productName: "Product 1", quantity: 1, price: 50 })
        .expect(200);

      const res = await request(app)
        .post(`/carts/${cart.body.id}/products`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .send({ productId: "prod-1", productName: "Product 1", quantity: 3, price: 50 });

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0]).toMatchObject({
        productId: "prod-1",
        quantity: 4,
      });
      expect(res.body.price).toBe(200);
    });
  });

  context("update product quantity", () => {
    it("should update product quantity and return 200", async () => {
      const cart = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      await request(app)
        .post(`/carts/${cart.body.id}/products`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .send({ productId: "prod-1", productName: "Product 1", quantity: 2, price: 50 })
        .expect(200);

      const res = await request(app)
        .put(`/carts/${cart.body.id}/products/prod-1`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.products[0]).toMatchObject({
        productId: "prod-1",
        quantity: 5,
        value: 250,
      });
      expect(res.body.price).toBe(250);
    });
  });

  context("remove product", () => {
    it("should remove a product from the cart and return 200", async () => {
      const cart = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      await request(app)
        .post(`/carts/${cart.body.id}/products`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .send({ productId: "prod-1", productName: "Product 1", quantity: 1, price: 50 })
        .expect(200);

      const res = await request(app)
        .delete(`/carts/${cart.body.id}/products/prod-1`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(0);
      expect(res.body.price).toBe(0);
    });
  });

  context("delete", () => {
    it("should delete a cart and return 204", async () => {
      const cart = await request(app)
        .post("/carts")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const res = await request(app)
        .delete(`/carts/${cart.body.id}`)
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return 500 when cart id does not exist", async () => {
      const res = await request(app)
        .delete("/carts/nonexistent-id")
        .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(500);
    });
  });
});
