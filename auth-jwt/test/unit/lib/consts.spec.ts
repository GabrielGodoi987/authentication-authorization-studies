describe("processEnv", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("loads JWT environment variables", () => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_ACCESS_TOKEN_EXPIRESIN = "15m";
    process.env.JWT_REFRESH_TOKEN_EXPIRESIN = "7d";
    process.env.JWT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nline1\nline2\n-----END PRIVATE KEY-----";
    process.env.JWT_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nline1\nline2\n-----END PUBLIC KEY-----";
    process.env.NODE_ENV = "test";

    const { processEnv } = require("../../../src/lib/consts");

    expect(processEnv.JWT_SECRET).toBe("test-secret");
    expect(processEnv.JWT_ACCESS_TOKEN_EXPIRESIN).toBe("15m");
    expect(processEnv.JWT_REFRESH_TOKEN_EXPIRESIN).toBe("7d");
    expect(processEnv.NODE_ENV).toBe("test");
  });

  it("replaces \\n with actual newlines in keys", () => {
    process.env.JWT_SECRET = "secret";
    process.env.JWT_ACCESS_TOKEN_EXPIRESIN = "15m";
    process.env.JWT_REFRESH_TOKEN_EXPIRESIN = "7d";
    process.env.JWT_PRIVATE_KEY = "line1\\nline2\\nline3";
    process.env.JWT_PUBLIC_KEY = "pub1\\npub2";
    process.env.NODE_ENV = "test";

    const { processEnv } = require("../../../src/lib/consts");

    expect(processEnv.JWT_PRIVATE_KEY).toBe("line1\nline2\nline3");
    expect(processEnv.JWT_PUBLIC_KEY).toBe("pub1\npub2");
  });
});
