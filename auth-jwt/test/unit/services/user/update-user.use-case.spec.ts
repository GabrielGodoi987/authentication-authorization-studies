import { UserRepository } from "../../../../src/domain/repositories/user.repository";
import { UserRepositoryImpl } from "../../../../src/infrastructure/repositories/user.repository";
import { UpdateUserUseCase } from "../../../../src/services/user.use-cases";
import { makeUser } from "../../unit-helpers/make-user.helper";

describe("UpdateUserUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new UpdateUserUseCase(repo as unknown as UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update and returns the user when found", async () => {
    jest.spyOn(console, "error").mockReturnValue();
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(user);
    jest.spyOn(UserRepositoryImpl.prototype, "update").mockResolvedValue(user);

    const result = await useCase.execute(user.getId(), { name: "John Doe" });

    expect(repo.update).toHaveBeenCalledWith(user.getId(), user);

    expect(result).toBe(user);
  });

  it("should throw UserNotFoundException when user not found", async () => {
    jest.spyOn(console, "error").mockReturnValue();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(null);

    await expect(
      useCase.execute("invalid-id", {
        name: "Jane Doe",
      }),
    ).rejects.toThrow("User was not found");
  });
});
