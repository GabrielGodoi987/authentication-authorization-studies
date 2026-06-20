import { getMetadataArgsStorage } from "typeorm";
import { BasePersistenceEntity } from "../../../../src/infrastructure/persistence/base-typeORM/base-persistence.entity";

function getColumnNames(target: Function): string[] {
  return getMetadataArgsStorage()
    .columns.filter((column) => column.target === target)
    .map((column) => column.propertyName);
}

function getColumnOptions(target: Function, propertyName: string) {
  return getMetadataArgsStorage().columns.find(
    (column) =>
      column.target === target && column.propertyName === propertyName,
  )?.options;
}

describe("BasePersistenceEntity", () => {
  it("should have an id column with uuid primary key", () => {
    const columns = getColumnNames(BasePersistenceEntity);
    const options = getColumnOptions(BasePersistenceEntity, "id");

    expect(columns).toContain("id");
    expect(options?.type).toBe("uuid");
    expect(options?.primary).toBe(true);
  });

  it("should have a createdAt column with datetime type", () => {
    const columns = getColumnNames(BasePersistenceEntity);
    const options = getColumnOptions(BasePersistenceEntity, "createdAt");

    expect(columns).toContain("createdAt");
    expect(options?.type).toBe("datetime");
  });

  it("should have an updatedAt column with datetime type", () => {
    const columns = getColumnNames(BasePersistenceEntity);
    const options = getColumnOptions(BasePersistenceEntity, "updatedAt");

    expect(columns).toContain("updatedAt");
    expect(options?.type).toBe("datetime");
  });

  it("should have a deletedAt column that is nullable", () => {
    const columns = getColumnNames(BasePersistenceEntity);
    const options = getColumnOptions(BasePersistenceEntity, "deletedAt");

    expect(columns).toContain("deletedAt");
    expect(options?.type).toBe("datetime");
    expect(options?.nullable).toBe(true);
  });
});
