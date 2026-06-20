function makeResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

describe("CartController", () => {
  let mockCreate: jest.Mock;
  let mockFindById: jest.Mock;
  let mockFindByUserId: jest.Mock;
  let mockAddProduct: jest.Mock;
  let mockUpdateQuantity: jest.Mock;
  let mockRemoveProduct: jest.Mock;
  let mockDelete: jest.Mock;
  let CartController: typeof import("../../../../src/http/controllers/cart.controller").CartController;

  beforeEach(() => {
    jest.resetModules();
    mockCreate = jest.fn();
    mockFindById = jest.fn();
    mockFindByUserId = jest.fn();
    mockAddProduct = jest.fn();
    mockUpdateQuantity = jest.fn();
    mockRemoveProduct = jest.fn();
    mockDelete = jest.fn();

    jest.doMock(
      "../../../../src/infrastructure/repositories/cart.repository",
      () => ({ CartRepositoryImpl: jest.fn() }),
    );

    jest.doMock("../../../../src/services/cart.use-cases", () => ({
      CreateCartUseCase: jest.fn().mockImplementation(() => ({
        execute: mockCreate,
      })),
      FindCartByIdUseCase: jest.fn().mockImplementation(() => ({
        execute: mockFindById,
      })),
      FindCartByUserIdUseCase: jest.fn().mockImplementation(() => ({
        execute: mockFindByUserId,
      })),
      AddProductToCartUseCase: jest.fn().mockImplementation(() => ({
        execute: mockAddProduct,
      })),
      UpdateCartProductQuantityUseCase: jest.fn().mockImplementation(() => ({
        execute: mockUpdateQuantity,
      })),
      RemoveProductFromCartUseCase: jest.fn().mockImplementation(() => ({
        execute: mockRemoveProduct,
      })),
      DeleteCartUseCase: jest.fn().mockImplementation(() => ({
        execute: mockDelete,
      })),
    }));

    CartController =
      require("../../../../src/http/controllers/cart.controller").CartController;
  });

  afterEach(() => {
    jest.dontMock("../../../../src/infrastructure/repositories/cart.repository");
    jest.dontMock("../../../../src/services/cart.use-cases");
  });

  const cart = { toJSON: jest.fn().mockReturnValue({ id: "cart-id" }) };
  const reqWithUser = { user: { id: "user-id" } };

  it("should create a cart for authenticated user", async () => {
    mockCreate.mockResolvedValue(cart);
    const res = makeResponse();

    await CartController.create(reqWithUser as any, res as any, jest.fn());

    expect(mockCreate).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "cart-id" });
  });

  it("should return 404 when user cart is not found", async () => {
    mockFindByUserId.mockResolvedValue(null);
    const res = makeResponse();

    await CartController.findByUserId(reqWithUser as any, res as any, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Cart not found" });
  });

  it("should find cart by id", async () => {
    mockFindById.mockResolvedValue(cart);
    const res = makeResponse();

    await CartController.findById(
      { ...reqWithUser, params: { id: "cart-id" } } as any,
      res as any,
      jest.fn(),
    );

    expect(mockFindById).toHaveBeenCalledWith("cart-id", "user-id");
    expect(res.json).toHaveBeenCalledWith({ id: "cart-id" });
  });

  it("should add product to cart", async () => {
    mockAddProduct.mockResolvedValue(cart);
    const res = makeResponse();
    const body = { productId: "product-id", quantity: 2, price: 10 };

    await CartController.addProduct(
      { ...reqWithUser, params: { cartId: "cart-id" }, body } as any,
      res as any,
      jest.fn(),
    );

    expect(mockAddProduct).toHaveBeenCalledWith("cart-id", "user-id", body);
    expect(res.json).toHaveBeenCalledWith({ id: "cart-id" });
  });

  it("should update product quantity", async () => {
    mockUpdateQuantity.mockResolvedValue(cart);
    const res = makeResponse();

    await CartController.updateProductQuantity(
      {
        ...reqWithUser,
        params: { cartId: "cart-id", productId: "product-id" },
        body: { quantity: 3 },
      } as any,
      res as any,
      jest.fn(),
    );

    expect(mockUpdateQuantity).toHaveBeenCalledWith(
      "cart-id",
      "product-id",
      "user-id",
      3,
    );
    expect(res.json).toHaveBeenCalledWith({ id: "cart-id" });
  });

  it("should remove product from cart", async () => {
    mockRemoveProduct.mockResolvedValue(cart);
    const res = makeResponse();

    await CartController.removeProduct(
      {
        ...reqWithUser,
        params: { cartId: "cart-id", productId: "product-id" },
      } as any,
      res as any,
      jest.fn(),
    );

    expect(mockRemoveProduct).toHaveBeenCalledWith(
      "cart-id",
      "product-id",
      "user-id",
    );
    expect(res.json).toHaveBeenCalledWith({ id: "cart-id" });
  });

  it("should delete cart", async () => {
    mockDelete.mockResolvedValue(true);
    const res = makeResponse();

    await CartController.delete(
      { ...reqWithUser, params: { id: "cart-id" } } as any,
      res as any,
      jest.fn(),
    );

    expect(mockDelete).toHaveBeenCalledWith("cart-id", "user-id");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
