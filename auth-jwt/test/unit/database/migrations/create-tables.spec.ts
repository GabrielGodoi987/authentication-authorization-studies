import { DataSource, QueryRunner } from "typeorm";
import { CreateTableUsersf47ac10b58cc4372a5670e02b2c3d479 } from "../../../../src/database/migrations/create-table-users";
import { CreateTableProducts1779670012718 } from "../../../../src/database/migrations/1779670012718-create-table-products";
import { CreateTableCart1779670052952 } from "../../../../src/database/migrations/1779670052952-create-table-cart";
import { CreateTableCartItems1779670100000 } from "../../../../src/database/migrations/1779670100000-create-table-cart-items";

async function tableExists(queryRunner: QueryRunner, name: string): Promise<boolean> {
  const rows = await queryRunner.query(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`,
  );
  return rows.length > 0;
}

let dataSource: DataSource;
let queryRunner: QueryRunner;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
  });
  await dataSource.initialize();
  queryRunner = dataSource.createQueryRunner();
});

afterAll(async () => {
  await queryRunner.release();
  await dataSource.destroy();
});

describe("CreateTableUsers migration", () => {
  const migration = new CreateTableUsersf47ac10b58cc4372a5670e02b2c3d479();

  it("creates the users table on up()", async () => {
    await migration.up(queryRunner);
    expect(await tableExists(queryRunner, "users")).toBe(true);
  });

  it("drops the users table on down()", async () => {
    await migration.down(queryRunner);
    expect(await tableExists(queryRunner, "users")).toBe(false);
  });
});

describe("CreateTableProducts migration", () => {
  const migration = new CreateTableProducts1779670012718();

  beforeEach(async () => {
    await migration.up(queryRunner);
  });

  afterEach(async () => {
    await migration.down(queryRunner);
  });

  it("creates the products table on up()", async () => {
    expect(await tableExists(queryRunner, "products")).toBe(true);
  });
});

describe("CreateTableCart migration (depends on users table)", () => {
  const userMigration = new CreateTableUsersf47ac10b58cc4372a5670e02b2c3d479();
  const cartMigration = new CreateTableCart1779670052952();

  beforeAll(async () => {
    await userMigration.up(queryRunner);
  });

  afterAll(async () => {
    await cartMigration.down(queryRunner);
    await userMigration.down(queryRunner);
  });

  it("creates the carts table on up() with FK referencing users", async () => {
    await cartMigration.up(queryRunner);
    expect(await tableExists(queryRunner, "carts")).toBe(true);
  });
});

describe("CreateTableCartItems migration (depends on carts and products)", () => {
  const userMigration = new CreateTableUsersf47ac10b58cc4372a5670e02b2c3d479();
  const productMigration = new CreateTableProducts1779670012718();
  const cartMigration = new CreateTableCart1779670052952();
  const cartItemsMigration = new CreateTableCartItems1779670100000();

  beforeAll(async () => {
    await userMigration.up(queryRunner);
    await productMigration.up(queryRunner);
    await cartMigration.up(queryRunner);
  });

  afterAll(async () => {
    await cartItemsMigration.down(queryRunner);
    await cartMigration.down(queryRunner);
    await productMigration.down(queryRunner);
    await userMigration.down(queryRunner);
  });

  it("creates the cart_items table on up()", async () => {
    await cartItemsMigration.up(queryRunner);
    expect(await tableExists(queryRunner, "cart_items")).toBe(true);
  });

  it("has the expected columns in cart_items", async () => {
    const columns = await queryRunner.query("PRAGMA table_info(cart_items)");
    const columnNames = columns.map((c: any) => c.name);
    expect(columnNames).toEqual(
      expect.arrayContaining(["id", "cartId", "productId", "quantity", "value"]),
    );
  });
});
