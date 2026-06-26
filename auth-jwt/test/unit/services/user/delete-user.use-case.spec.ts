import { UserRepositoryImpl } from "../../../../src/infrastructure/repositories/user.repository";
import { DeleteUserUseCase } from "../../../../src/services/user.use-cases";
import { makeUser } from "../../unit-helpers/make-user.helper";

describe("DeleteUserUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new DeleteUserUseCase(repo);
  });

  it("should return true when user is deleted", async () => {
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(user);
    jest.spyOn(UserRepositoryImpl.prototype, "delete").mockResolvedValue(true);

    const result = await useCase.execute("some-id");
    expect(repo.delete).toHaveBeenCalledWith("some-id");

    expect(result).toBe(true);
  });

  it("should throw UserNotFoundException when user does not exist", async () => {
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(null);

    await expect(useCase.execute("nonexistent-id")).rejects.toThrow(
      "User was not found",
    );
  });
});
