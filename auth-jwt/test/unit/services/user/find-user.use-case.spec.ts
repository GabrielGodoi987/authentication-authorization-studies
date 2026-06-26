import { UserRepository } from "../../../../src/domain/repositories/user.repository";
import { UserRepositoryImpl } from "../../../../src/infrastructure/repositories/user.repository";
import {
  FindAllUsersUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
} from "../../../../src/services/user.use-cases";
import { makeUser } from "../../unit-helpers/make-user.helper";

describe("FindUserByIdUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: FindUserByIdUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new FindUserByIdUseCase(repo as unknown as UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return a user when found", async () => {
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(user);

    const result = await useCase.execute(user.getId());

    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(result).toBe(user);
  });

  it("should return null when not found", async () => {
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(null);

    expect(async () => await useCase.execute("nonexistent-id")).rejects.toThrow(
      "User was not found",
    );
  });
});

describe("FindUserByEmailUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: FindUserByEmailUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new FindUserByEmailUseCase(repo as unknown as UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return a user when found", async () => {
    const user = makeUser();
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(user);

    const result = await useCase.execute("john@doe.com");

    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(result).toBe(user);
  });

  it("should return null when not found", async () => {
    jest.spyOn(UserRepositoryImpl.prototype, "findOne").mockResolvedValue(null);

    expect(
      async () => await useCase.execute("unknown@test.com"),
    ).rejects.toThrow("Cannot found user with email");
  });
});

describe("FindAllUsersUseCase", () => {
  let repo: jest.Mocked<UserRepositoryImpl>;
  let useCase: FindAllUsersUseCase;

  beforeEach(() => {
    repo = new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    useCase = new FindAllUsersUseCase(repo as unknown as UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return all users", async () => {
    const users = [makeUser(), makeUser({ name: "Another User" })];
    jest.spyOn(UserRepositoryImpl.prototype, "find").mockResolvedValue(users);

    const result = await useCase.execute();

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toBe(users);
  });

  it("should return empty array when no users", async () => {
    jest.spyOn(UserRepositoryImpl.prototype, "find").mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
