import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUsersf47ac10b58cc4372a5670e02b2c3d479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updatedAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        deletedAt DATETIME
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
