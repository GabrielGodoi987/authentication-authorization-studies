import { UserRepository } from "../../../src/domain/repositorie/user.repository";
import { UserRepositoryImpl } from "../../../src/infrastructure/repositories/user.repository";
import { CreateUserUseCase } from "../../../src/services/user.use-cases";
import { makeUser } from "../unit-helpers/make-user.helper";

jest.mock("../../../src/infrastructure/repositories/user.repository");

describe("CreateUserUseCase - unit test", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new CreateUserUseCase(repo as unknown as UserRepository);
  });

  it("creates a user when email does not exist", async () => {
    const user = makeUser();
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue(user);

    const result = await useCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "Strong1Pass",
    });

    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@doe.com",
      password: "Strong1Pass",
    });
    expect(result.toJSON()).toMatchObject({
      name: "John Doe",
      email: "john@doe.com",
    });
    expect(result.toJSON().id).toEqual(expect.any(String));
  });

  it("throws when email already exists", async () => {
    repo.findOne.mockResolvedValue(makeUser());

    await expect(
      useCase.execute({
        name: "John Doe",
        email: "john@doe.com",
        password: "Strong1Pass",
      }),
    ).rejects.toThrow("User already exists");

    expect(repo.save).not.toHaveBeenCalled();
  });
});
