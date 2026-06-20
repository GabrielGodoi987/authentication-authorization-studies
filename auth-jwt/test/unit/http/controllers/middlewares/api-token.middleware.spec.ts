import { ApiTokenMiddleware } from "../../../../../src/http/controllers/middlewares/api-token.middleware";

function makeResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("ApiTokenMiddleware", () => {
  const middleware = new ApiTokenMiddleware();

  beforeEach(() => {
    process.env.API_TOKEN = "valid-api-token";
  });

  afterEach(() => {
    delete process.env.API_TOKEN;
  });

  it("should return 401 when API token is missing", async () => {
    const req = { headers: {} };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyApiToken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "API token not provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 when API token is invalid", async () => {
    const req = { headers: { "x-api-token": "invalid-token" } };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyApiToken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid API token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when API token is valid", async () => {
    const req = { headers: { "x-api-token": "valid-api-token" } };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyApiToken(req as any, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
