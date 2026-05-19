import { UserRepository } from "../../../src/domain/repositorie/user.repository";
import { UserRepositoryImpl } from "../../../src/infrastructure/repositories/user.repository";
import { UpdateUserUseCase } from "../../../src/services/user.use-cases";
import { makeUser } from "../unit-helpers/make-user.helper";

jest.mock("../../../src/infrastructure/repositories/user.repository");

describe("UpdateUserUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new UpdateUserUseCase(repo as unknown as UserRepository);
  });

  it("updates and returns the user when found", async () => {
    const user = makeUser();
    repo.update.mockResolvedValue(user);

    const result = await useCase.execute(user.getId(), { name: "Jane Doe" });

    expect(repo.update).toHaveBeenCalledWith(user.getId(), {
      name: "Jane Doe",
    });
    expect(result).toBe(user);
  });

  it("returns null when user not found", async () => {
    repo.update.mockResolvedValue(null);

    const result = await useCase.execute("nonexistent-id", {
      name: "Jane Doe",
    });

    expect(result).toBeNull();
  });
});
