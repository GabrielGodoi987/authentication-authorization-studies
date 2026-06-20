import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AuthMiddleware } from "../../../../../src/http/controllers/middlewares/auth.middleware";
import {
  ExpiredTokenException,
  MissingTokenException,
} from "../../../../../src/http/exceptions/auth.exception";

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
  },
  TokenExpiredError: class TokenExpiredError extends Error {
    constructor() {
      super("jwt expired");
      this.name = "TokenExpiredError";
    }
  },
}));

function makeResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("AuthMiddleware", () => {
  const middleware = new AuthMiddleware();
  const verifyMock = jwt.verify as jest.Mock;

  beforeEach(() => {
    verifyMock.mockReset();
  });

  it("should skip unprotected routes", async () => {
    const req = { url: "/health", headers: {} };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyToken(req as any, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(verifyMock).not.toHaveBeenCalled();
  });

  it("should call next with MissingTokenException when token is missing", async () => {
    const req = { url: "/users", headers: {}, cookies: {} };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyToken(req as any, res as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(MissingTokenException));
  });

  it("should attach user and call next when token is valid", async () => {
    verifyMock.mockReturnValue({
      sub: "user-id",
      userName: "John Doe",
      userEmail: "john.doe@email.com",
    });
    const req = {
      url: "/users",
      headers: { authorization: "Bearer valid-token" },
      cookies: {},
    };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyToken(req as any, res as any, next);

    expect((req as any).user).toEqual({
      id: "user-id",
      name: "John Doe",
      email: "john.doe@email.com",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should call next with ExpiredTokenException when token is expired", async () => {
    verifyMock.mockImplementation(() => {
      throw new TokenExpiredError("jwt expired", new Date());
    });
    const req = {
      url: "/users",
      headers: { authorization: "Bearer expired-token" },
      cookies: {},
    };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyToken(req as any, res as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(ExpiredTokenException));
  });

  it("should return 403 when token is invalid", async () => {
    verifyMock.mockImplementation(() => {
      throw new Error("invalid token");
    });
    const req = {
      url: "/users",
      headers: { authorization: "Bearer invalid-token" },
      cookies: {},
    };
    const res = makeResponse();
    const next = jest.fn();

    await middleware.verifyToken(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });
});
