import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableProducts1779670012718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updatedAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        deletedAt DATETIME
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);
  }
}
