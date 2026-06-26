import { UserRepository } from "../../../../src/domain/repositories/user.repository";
import { UserRepositoryImpl } from "../../../../src/infrastructure/repositories/user.repository";
import { CreateUserUseCase } from "../../../../src/services/user.use-cases";
import { makeUser } from "../../unit-helpers/make-user.helper";

describe("CreateUserUseCase - unit test", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new CreateUserUseCase(repo as unknown as UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a user when email does not exist", async () => {
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(null);
    jest.spyOn(UserRepositoryImpl.prototype, "save").mockResolvedValue(user);

    const result = await useCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "Strong1Pass",
    });

    expect(repo.findOne).toHaveBeenCalledTimes(1);

    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedUser = repo.save.mock.calls[0][0];
    expect(savedUser.getId()).toBe("00000000-0000-0000-0000-000000000000");
    expect(savedUser.getName()).toBe(user.getName());
    expect(savedUser.getEmail()).toBe(user.getEmail());
    expect(savedUser.getPassword()).toBe("Strong1Pass");

    expect(result.toJSON()).toMatchObject({
      name: "John Doe",
      email: "john@doe.com",
    });
    expect(result.toJSON().id).toEqual(expect.any(String));
  });

  it("should throw when email already exists", async () => {
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(makeUser());
    jest.spyOn(UserRepositoryImpl.prototype, "save");

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
