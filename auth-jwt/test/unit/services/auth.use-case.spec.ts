import bcrypt from "bcrypt";
import { UserRepositoryImpl } from "../../../src/infrastructure/repositories/user.repository";
import {
  AuthUseCase,
  TokenProvider,
} from "../../../src/services/auth.use-cases";
import { makeUser } from "../unit-helpers/make-user.helper";

describe("AuthUseCase - unit test", () => {
  let repo: UserRepositoryImpl;
  let useCase: AuthUseCase;
  let accessTokenSpy: jest.SpyInstance;
  let refreshTokenSpy: jest.SpyInstance;

  beforeEach(() => {
    repo = new UserRepositoryImpl();
    useCase = new AuthUseCase(repo);
    accessTokenSpy = jest.spyOn(TokenProvider, "generateAccessToken");
    refreshTokenSpy = jest.spyOn(TokenProvider, "generateRefreshToken");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user and token when credentials are valid", async () => {
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(user);
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

    accessTokenSpy.mockReturnValue("Fake-jwt-accessToken");
    refreshTokenSpy.mockReturnValue("Fake-jwt-refreshToken");

    const result = await useCase.execute(user.getEmail(), "Strong1Pass");

    expect(repo.findOne).toHaveBeenCalledTimes(1);

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "Strong1Pass",
      user.getPassword(),
    );

    expect(refreshTokenSpy).toHaveBeenCalledWith({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    });

    expect(accessTokenSpy).toHaveBeenCalledWith({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    });

    expect(result.user.toJSON()).toEqual(user.toJSON());

    expect(result.accessToken).toBe("Fake-jwt-accessToken");
    expect(result.refreshToken).toBe("Fake-jwt-refreshToken");
  });

  it("should throw InvalidCredentials exception when password does not match", async () => {
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(user);
    jest.spyOn(console, "error").mockReturnValue();

    accessTokenSpy.mockReturnValue(null as any);
    refreshTokenSpy.mockReturnValue(null as any);

    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

    await expect(
      useCase.execute(user.getEmail(), "wrong-password"),
    ).rejects.toThrow("Credential error");
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(accessTokenSpy).not.toHaveBeenCalled();
    expect(refreshTokenSpy).not.toHaveBeenCalled();
  });

  it("should throw when user is not found", async () => {
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(null);
    jest.spyOn(console, "error").mockReturnValue();

    accessTokenSpy.mockReturnValue(null as any);

    refreshTokenSpy.mockReturnValue(null as any);

    await expect(
      useCase.execute("unknown@email.com", "Strong1Pass"),
    ).rejects.toThrow("Invalid credentials");

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(accessTokenSpy).not.toHaveBeenCalled();
    expect(refreshTokenSpy).not.toHaveBeenCalled();
  });
});
