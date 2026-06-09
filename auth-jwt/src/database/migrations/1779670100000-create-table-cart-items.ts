import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCartItems1779670100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        cartId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        value REAL NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updatedAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        deletedAt DATETIME,
        FOREIGN KEY (cartId) REFERENCES carts(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cart_items;`);
  }
}
