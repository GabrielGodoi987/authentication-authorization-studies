import { DataSource } from "typeorm";
import {
  getDataSource,
  resetDataSource,
  AppDataSource,
} from "../../../src/database/source";

describe("getDataSource", () => {
  beforeEach(() => {
    resetDataSource();
  });

  it("should return a DataSource instance", () => {
    const ds = getDataSource();
    expect(ds).toBeInstanceOf(DataSource);
  });

  it("should return the same instance on multiple calls (singleton)", () => {
    const ds1 = getDataSource();
    const ds2 = getDataSource();
    expect(ds1).toBe(ds2);
  });
});

describe("resetDataSource", () => {
  beforeEach(() => {
    resetDataSource();
  });

  it("should clear the singleton instance", () => {
    const ds1 = getDataSource();
    resetDataSource();
    const ds2 = getDataSource();
    expect(ds1).not.toBe(ds2);
  });

  it("should not throw when called on an uninitialized DataSource", () => {
    resetDataSource();
    expect(() => resetDataSource()).not.toThrow();
  });
});

describe("AppDataSource (Proxy)", () => {
  beforeEach(() => {
    resetDataSource();
  });

  it("should delegate getRepository to getDataSource()", () => {
    const repo = AppDataSource.getRepository;
    expect(typeof repo).toBe("function");
  });

  it("should delegate property access to the underlying DataSource", () => {
    const options = AppDataSource.options;
    expect(options).toBeDefined();
    expect(options.type).toBe("sqlite");
  });

  it("should pick up DB_PATH env var on fresh DataSource after reset", () => {
    const dsBefore = getDataSource();
    expect(dsBefore.options.database).toBe("database.sqlite");

    resetDataSource();
    process.env.DB_PATH = ":memory:";

    const dsAfter = getDataSource();
    expect(dsAfter.options.database).toBe(":memory:");
    delete process.env.DB_PATH;
  });
});
