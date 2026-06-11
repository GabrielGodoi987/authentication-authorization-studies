jest.mock("../../../src/app", () => ({
  app: {
    listen: jest.fn((_port: any, cb: any) => {
      if (typeof cb === "function") cb();
    }),
  },
}));

jest.mock("../../../src/database/seeds/main", () => ({
  MainSeeder: jest.fn().mockResolvedValue({ message: "seeded", data: {} }),
}));

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("main", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls MainSeeder on startup", async () => {
    const { main } = await import("../../../src/webserver/server");
    const { MainSeeder } = require("../../../src/database/seeds/main");
    await main();
    expect(MainSeeder).toHaveBeenCalledTimes(1);
  });

  it("starts the server on port 3000 by default", async () => {
    jest.resetModules();
    const { main } = await import("../../../src/webserver/server");
    const { app } = require("../../../src/app");
    await main();
    expect(app.listen).toHaveBeenCalledTimes(1);
    expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it("uses PORT environment variable when set", async () => {
    process.env.PORT = "4000";
    jest.resetModules();
    const { main } = await import("../../../src/webserver/server");
    const { app } = require("../../../src/app");
    await main();
    expect(app.listen).toHaveBeenCalledWith("4000", expect.any(Function));
    delete process.env.PORT;
  });
});
