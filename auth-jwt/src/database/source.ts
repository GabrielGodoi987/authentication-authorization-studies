import { DataSource } from "typeorm";
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
      entities: [UserPersistenceEntity],
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
    return Reflect.get(getDataSource(), prop);
  },
});
