import { UserRepository } from "../../../src/domain/repositorie/user.repository";
import { UserRepositoryImpl } from "../../../src/infrastructure/repositories/user.repository";
import { DeleteUserUseCase } from "../../../src/services/user.use-cases";

jest.mock("../../../src/infrastructure/repositories/user.repository");

describe("DeleteUserUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new DeleteUserUseCase(repo as unknown as UserRepository);
  });

  it("returns true when user is deleted", async () => {
    repo.delete.mockResolvedValue(true);

    const result = await useCase.execute("some-id");

    expect(repo.delete).toHaveBeenCalledWith("some-id");
    expect(result).toBe(true);
  });

  it("returns false when user does not exist", async () => {
    repo.delete.mockResolvedValue(false);

    const result = await useCase.execute("nonexistent-id");

    expect(result).toBe(false);
  });
});
