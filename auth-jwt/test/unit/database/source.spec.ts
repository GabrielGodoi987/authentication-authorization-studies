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

  it("returns a DataSource instance", () => {
    const ds = getDataSource();
    expect(ds).toBeInstanceOf(DataSource);
  });

  it("returns the same instance on multiple calls (singleton)", () => {
    const ds1 = getDataSource();
    const ds2 = getDataSource();
    expect(ds1).toBe(ds2);
  });
});

describe("resetDataSource", () => {
  beforeEach(() => {
    resetDataSource();
  });

  it("clears the singleton instance", () => {
    const ds1 = getDataSource();
    resetDataSource();
    const ds2 = getDataSource();
    expect(ds1).not.toBe(ds2);
  });

  it("does not throw when called on an uninitialized DataSource", () => {
    resetDataSource();
    expect(() => resetDataSource()).not.toThrow();
  });
});

describe("AppDataSource (Proxy)", () => {
  beforeEach(() => {
    resetDataSource();
  });

  it("delegates getRepository to getDataSource()", () => {
    const repo = AppDataSource.getRepository;
    expect(typeof repo).toBe("function");
  });

  it("delegates property access to the underlying DataSource", () => {
    const options = AppDataSource.options;
    expect(options).toBeDefined();
    expect(options.type).toBe("sqlite");
  });

  it("picks up DB_PATH env var on fresh DataSource after reset", () => {
    const dsBefore = getDataSource();
    expect(dsBefore.options.database).toBe("database.sqlite");

    resetDataSource();
    process.env.DB_PATH = ":memory:";

    const dsAfter = getDataSource();
    expect(dsAfter.options.database).toBe(":memory:");
    delete process.env.DB_PATH;
  });
});
