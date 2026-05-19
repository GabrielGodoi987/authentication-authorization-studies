describe("LogTracker", () => {
  let debugSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.LOG_LEVEL = "debug";
    jest.resetModules();

    debugSpy = jest.spyOn(console, "debug").mockImplementation();
    infoSpy = jest.spyOn(console, "info").mockImplementation();
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
    errorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.LOG_LEVEL;
  });

  describe("log levels", () => {
    it.each([
      { level: "debug", message: "debug message", spyKey: "debugSpy" },
      { level: "info", message: "info message", spyKey: "infoSpy" },
      { level: "warn", message: "warn message", spyKey: "warnSpy" },
      { level: "error", message: "error message", spyKey: "errorSpy" },
    ])("$level calls the right console method", ({ level, message, spyKey }) => {
      const { LogTracker: LT } = require("../../../src/lib/log");
      const spy =
        spyKey === "debugSpy"
          ? debugSpy
          : spyKey === "infoSpy"
            ? infoSpy
            : spyKey === "warnSpy"
              ? warnSpy
              : errorSpy;
      (LT as any)[level](message);
      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain(`[${level.toUpperCase()}]`);
      expect(output).toContain(message);
    });
  });

  describe("metadata and errors", () => {
    it("includes metadata in the output", () => {
      const { LogTracker } = require("../../../src/lib/log");
      LogTracker.info("with meta", { userId: "123", role: "admin" });
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('{"userId":"123","role":"admin"}'),
      );
    });

    it("includes error stack in warn", () => {
      const { LogTracker } = require("../../../src/lib/log");
      const error = new Error("something went wrong");
      LogTracker.warn("warning with error", error);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(error.stack!),
      );
    });

    it("includes error stack in error", () => {
      const { LogTracker } = require("../../../src/lib/log");
      const error = new Error("something went wrong");
      LogTracker.error("error with error", error);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(error.stack!),
      );
    });

    it("includes error and meta together", () => {
      const { LogTracker } = require("../../../src/lib/log");
      const error = new Error("fail");
      LogTracker.error("context", error, { key: "value" });
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(error.stack!),
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('{"key":"value"}'),
      );
    });
  });

  describe("caller info", () => {
    it("includes file:line of the caller", () => {
      const { LogTracker } = require("../../../src/lib/log");
      LogTracker.info("check caller");
      const output = infoSpy.mock.calls[0][0] as string;
      expect(output).toMatch(/test\/unit\/lib\/log\.spec\.ts:\d+/);
    });
  });

  describe("level filtering", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("skips debug when LOG_LEVEL=info", () => {
      process.env.LOG_LEVEL = "info";
      const { LogTracker } = require("../../../src/lib/log");
      LogTracker.debug("should not appear");
      LogTracker.info("should appear");
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledTimes(1);
    });

    it("skips info when LOG_LEVEL=warn", () => {
      process.env.LOG_LEVEL = "warn";
      const { LogTracker } = require("../../../src/lib/log");
      LogTracker.info("should not appear");
      LogTracker.warn("should appear");
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("logs everything when LOG_LEVEL=debug", () => {
      process.env.LOG_LEVEL = "debug";
      const { LogTracker } = require("../../../src/lib/log");
      LogTracker.debug("debug");
      LogTracker.info("info");
      LogTracker.warn("warn");
      LogTracker.error("error");
      expect(console.debug).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe("production mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      jest.resetModules();
    });

    afterEach(() => {
      process.env.NODE_ENV = "test";
    });

    it("outputs JSON in production", () => {
      const { LogTracker } = require("../../../src/lib/log");
      LogTracker.info("prod log", { env: "prod" });
      const output = (console.info as jest.Mock).mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed).toMatchObject({
        level: "info",
        message: "prod log",
        env: "prod",
      });
      expect(parsed).toHaveProperty("timestamp");
    });

    it("includes only error message (not stack) in JSON", () => {
      const { LogTracker } = require("../../../src/lib/log");
      const error = new Error("secret details");
      LogTracker.error("oops", error);
      const output = (console.error as jest.Mock).mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.error).toBe("secret details");
      expect(parsed.message).toBe("oops");
    });
  });
});
