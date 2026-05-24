import { DataSource } from "typeorm";
import { CartProductPersistenceEntity } from "../infrastructure/persistence/cart-product-persistence.entity";
import { CartPersistenceEntity } from "../infrastructure/persistence/cart-persistence.entity";
import { UserPersistenceEntity } from "../infrastructure/persistence/user-persistence.entity";

let dataSource: DataSource | null = null;

function getDbPath(): string {
  return process.env.DB_PATH || "database.sqlite";
}

export function getDataSource(): DataSource {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: getDbPath(),
      synchronize: true,
      entities: [UserPersistenceEntity, CartPersistenceEntity, CartProductPersistenceEntity],
      migrations: [`${__dirname}/migrations/*.{ts,js}`],
    });
  }
  return dataSource;
}

export function resetDataSource(): void {
  if (dataSource?.isInitialized) {
    dataSource.destroy();
  }
  dataSource = null;
}

export const AppDataSource = new Proxy({} as DataSource, {
  get(_target, prop) {
    const target = getDataSource();
    const value = Reflect.get(target, prop);
    if (typeof value === "function") {
      return value.bind(target);
    }
    return value;
  },
});
