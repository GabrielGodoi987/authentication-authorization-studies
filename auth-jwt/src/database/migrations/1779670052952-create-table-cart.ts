import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCart1779670052952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        price REAL NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updatedAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        deletedAt DATETIME,
        FOREIGN KEY (userId) REFERENCES users(id) 
                    ON DELETE CASCADE 
                    ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS carts;`);
  }
}
