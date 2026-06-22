import { UserRepository } from "../../../../src/domain/repositories/user.repository";
import { UserRepositoryImpl } from "../../../../src/infrastructure/repositories/user.repository";
import { DeleteUserUseCase } from "../../../../src/services/user.use-cases";
import { makeUser } from "../../unit-helpers/make-user.helper";

jest.mock("../../../src/infrastructure/repositories/user.repository");

describe("DeleteUserUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new DeleteUserUseCase(repo as unknown as UserRepository);
  });

  it("should return true when user is deleted", async () => {
    const user = makeUser();
    repo.findOne.mockResolvedValue(user);
    repo.delete.mockResolvedValue(true);

    const result = await useCase.execute("some-id");
    expect(repo.delete).toHaveBeenCalledWith("some-id");

    expect(result).toBe(true);
  });

  it("should return false when user does not exist", async () => {
    repo.delete.mockResolvedValue(false);

    await expect(useCase.execute("nonexistent-id")).rejects.toThrow(
      "User was not found",
    );
  });
});
