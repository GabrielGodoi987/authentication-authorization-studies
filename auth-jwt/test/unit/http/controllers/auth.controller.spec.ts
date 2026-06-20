import { MissingTokenException } from "../../../../src/http/exceptions/auth.exception";

function makeResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
}

describe("AuthController", () => {
  let mockAuthExecute: jest.Mock;
  let mockRefreshToken: jest.Mock;
  let AuthController: typeof import("../../../../src/http/controllers/auth.controller").AuthController;
  let generateAccessTokenCookie: typeof import("../../../../src/http/controllers/auth.controller").generateAccessTokenCookie;
  let generateRefreshTokenCookie: typeof import("../../../../src/http/controllers/auth.controller").generateRefreshTokenCookie;

  beforeEach(() => {
    jest.resetModules();
    mockAuthExecute = jest.fn();
    mockRefreshToken = jest.fn();

    jest.doMock(
      "../../../../src/infrastructure/repositories/user.repository",
      () => ({
        UserRepositoryImpl: jest.fn(),
      }),
    );

    jest.doMock("../../../../src/services/auth.use-cases", () => ({
      AuthUseCase: jest.fn().mockImplementation(() => ({
        execute: mockAuthExecute,
      })),
      RefreshTokenUseCase: jest.fn().mockImplementation(() => ({
        refreshToken: mockRefreshToken,
      })),
    }));

    const controllerModule = require("../../../../src/http/controllers/auth.controller");
    AuthController = controllerModule.AuthController;
    generateAccessTokenCookie = controllerModule.generateAccessTokenCookie;
    generateRefreshTokenCookie = controllerModule.generateRefreshTokenCookie;
  });

  afterEach(() => {
    jest.dontMock(
      "../../../../src/infrastructure/repositories/user.repository",
    );
    jest.dontMock("../../../../src/services/auth.use-cases");
    jest.restoreAllMocks();
  });

  it("should login and set auth cookies", async () => {
    const user = { toJSON: jest.fn().mockReturnValue({ id: "user-id" }) };
    mockAuthExecute.mockResolvedValue({
      user,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    const req = { body: { email: "john@email.com", password: "Strong123" } };
    const res = makeResponse();
    const next = jest.fn();

    await AuthController.login(req as any, res as any, next);

    expect(mockAuthExecute).toHaveBeenCalledWith("john@email.com", "Strong123");
    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "access-token",
      expect.any(Object),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.any(Object),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: { id: "user-id" },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass login errors to next", async () => {
    jest.spyOn(console, "error").mockImplementation();
    const error = new Error("invalid credentials");
    mockAuthExecute.mockRejectedValue(error);
    const res = makeResponse();
    const next = jest.fn();

    await AuthController.login({ body: {} } as any, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return MissingTokenException when refresh token is missing", async () => {
    const res = makeResponse();

    await AuthController.refresh(
      { body: {}, headers: {}, cookies: {} } as any,
      res as any,
      jest.fn(),
    );

    expect(res.json).toHaveBeenCalledWith(
      new MissingTokenException({ message: "Token is missing" }),
    );
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it("should refresh tokens and set cookies", async () => {
    mockRefreshToken.mockResolvedValue({
      newAccessToken: "new-access-token",
      newRefreshToken: "new-refresh-token",
    });
    const req = {
      body: { refreshToken: "refresh-token" },
      headers: {},
      cookies: {},
    };
    const res = makeResponse();

    await AuthController.refresh(req as any, res as any, jest.fn());

    expect(mockRefreshToken).toHaveBeenCalledWith({
      refreshToken: "refresh-token",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      newAccessToken: "new-access-token",
      newRefreshToken: "new-refresh-token",
    });
  });

  it("should logout clearing cookies", () => {
    const res = makeResponse();

    AuthController.logout({} as any, res as any);

    expect(res.clearCookie).toHaveBeenCalledWith("accessToken");
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it("should generate access and refresh token cookies", () => {
    const res = makeResponse();

    generateAccessTokenCookie(res as any, "access-token");
    generateRefreshTokenCookie(res as any, "refresh-token");

    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "access-token",
      expect.objectContaining({ httpOnly: true, path: "/" }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.objectContaining({ httpOnly: true, path: "/refresh-token" }),
    );
  });
});
