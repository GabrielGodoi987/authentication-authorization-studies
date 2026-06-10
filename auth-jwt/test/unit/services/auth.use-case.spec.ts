import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../src/domain/repositories/user.repository";
import { UserRepositoryImpl } from "../../../src/infrastructure/repositories/user.repository";
import { AuthUseCase } from "../../../src/services/auth.use-cases";
import { makeUser } from "../unit-helpers/make-user.helper";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../src/infrastructure/repositories/user.repository");

describe("AuthUseCase - unit test", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: AuthUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new AuthUseCase(repo as unknown as UserRepository);
  });

  it("returns user and token when credentials are valid", async () => {
    const user = makeUser();
    repo.findOne.mockResolvedValue(user);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

    const result = await useCase.execute(user.getEmail(), "Strong1Pass");

    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      "Strong1Pass",
      user.getPassword(),
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { userName: user.getName(), userEmail: user.getEmail() },
      expect.any(String),
      { expiresIn: "1h" },
    );
    expect(result.user.toJSON()).toEqual(user.toJSON());
    expect(result.token).toBe("fake-jwt-token");
  });

  it("throws when user is not found", async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(
      useCase.execute("unknown@email.com", "Strong1Pass"),
    ).rejects.toThrow("Invalid credentials");

    expect(bcrypt.compareSync).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("throws when password does not match", async () => {
    const user = makeUser();
    repo.findOne.mockResolvedValue(user);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    await expect(
      useCase.execute(user.getEmail(), "wrong-password"),
    ).rejects.toThrow("Invalid credentials");

    expect(bcrypt.compareSync).toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
