function makeResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

describe("UserController", () => {
  let mockCreate: jest.Mock;
  let mockFindById: jest.Mock;
  let mockFindByEmail: jest.Mock;
  let mockFindAll: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;
  let UserController: typeof import("../../../../src/http/controllers/user.controller").UserController;

  beforeEach(() => {
    jest.resetModules();
    mockCreate = jest.fn();
    mockFindById = jest.fn();
    mockFindByEmail = jest.fn();
    mockFindAll = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();

    jest.doMock(
      "../../../../src/infrastructure/repositories/user.repository",
      () => ({ UserRepositoryImpl: jest.fn() }),
    );

    jest.doMock("../../../../src/services/user.use-cases", () => ({
      CreateUserUseCase: jest.fn().mockImplementation(() => ({
        execute: mockCreate,
      })),
      FindUserByIdUseCase: jest.fn().mockImplementation(() => ({
        execute: mockFindById,
      })),
      FindUserByEmailUseCase: jest.fn().mockImplementation(() => ({
        execute: mockFindByEmail,
      })),
      FindAllUsersUseCase: jest.fn().mockImplementation(() => ({
        execute: mockFindAll,
      })),
      UpdateUserUseCase: jest.fn().mockImplementation(() => ({
        execute: mockUpdate,
      })),
      DeleteUserUseCase: jest.fn().mockImplementation(() => ({
        execute: mockDelete,
      })),
    }));

    UserController =
      require("../../../../src/http/controllers/user.controller").UserController;
  });

  afterEach(() => {
    jest.dontMock("../../../../src/infrastructure/repositories/user.repository");
    jest.dontMock("../../../../src/services/user.use-cases");
  });

  const user = { toJSON: jest.fn().mockReturnValue({ id: "user-id" }) };

  it("should create a user", async () => {
    mockCreate.mockResolvedValue(user);
    const res = makeResponse();

    await UserController.create({ body: { name: "John" } } as any, res as any, jest.fn());

    expect(mockCreate).toHaveBeenCalledWith({ name: "John" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "user-id" });
  });

  it("should find all users", async () => {
    mockFindAll.mockResolvedValue([user]);
    const res = makeResponse();

    await UserController.findAll({} as any, res as any, jest.fn());

    expect(res.json).toHaveBeenCalledWith([{ id: "user-id" }]);
  });

  it("should return 404 when user by id is not found", async () => {
    mockFindById.mockResolvedValue(null);
    const res = makeResponse();

    await UserController.findById({ params: { id: "missing-id" } } as any, res as any, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should require email query when finding by email", async () => {
    const res = makeResponse();

    await UserController.findByEmail({ query: {} } as any, res as any, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email query parameter is required",
    });
  });

  it("should update a user", async () => {
    mockUpdate.mockResolvedValue(user);
    const res = makeResponse();

    await UserController.update(
      { params: { id: "user-id" }, body: { name: "Jane" } } as any,
      res as any,
      jest.fn(),
    );

    expect(mockUpdate).toHaveBeenCalledWith("user-id", { name: "Jane" });
    expect(res.json).toHaveBeenCalledWith({ id: "user-id" });
  });

  it("should delete a user", async () => {
    mockDelete.mockResolvedValue(true);
    const res = makeResponse();

    await UserController.delete({ params: { id: "user-id" } } as any, res as any, jest.fn());

    expect(mockDelete).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
