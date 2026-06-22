import request from "supertest";
import { app } from "../../../src/app";
import { getDataSource, resetDataSource } from "../../../src/database/source";
import { CartItemsPersistenceEntity } from "../../../src/infrastructure/persistence/cart-items-persistence.entity";
import { CartPersistenceEntity } from "../../../src/infrastructure/persistence/cart-persistence.entity";
import { UserPersistenceEntity } from "../../../src/infrastructure/persistence/user-persistence.entity";

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

describe("Debug cart 500", () => {
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
  });

  afterAll(async () => {
    const ds = getDataSource();
    if (ds.isInitialized) await ds.destroy();
  });

  it("should debug add product", async () => {
    const token = await login();
    console.log("TOKEN:", token);

    const cartRes = await request(app)
      .post("/carts")
      .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);
    console.log("CART:", JSON.stringify(cartRes.body));

    const addRes = await request(app)
      .post(`/carts/${cartRes.body.id}/products`)
      .set("x-api-token", API_TOKEN)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: "prod-1",
        productName: "Product 1",
        quantity: 2,
        price: 50,
      });

    console.log("ADD STATUS:", addRes.status);
    console.log("ADD BODY:", JSON.stringify(addRes.body));

    expect(addRes.status).toBe(200);
  });
});
