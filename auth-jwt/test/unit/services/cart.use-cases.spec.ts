import { CartItemsEntity } from "../../../src/domain/entities/cart-items.entity";
import { CartEntity } from "../../../src/domain/entities/cart.entity";
import { CartRepository } from "../../../src/domain/repositories/cart.repository";
import {
  CartAccessDeniedException,
  CartNotFoundException,
  CartProductNotFoundException,
} from "../../../src/http/exceptions/cart.exception";
import {
  AddProductToCartUseCase,
  CreateCartUseCase,
  DeleteCartUseCase,
  FindCartByIdUseCase,
  FindCartByUserIdUseCase,
  RemoveProductFromCartUseCase,
  UpdateCartProductQuantityUseCase,
} from "../../../src/services/cart.use-cases";

function makeRepo(): jest.Mocked<CartRepository> {
  return {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    saveProduct: jest.fn(),
    findProductsByCartId: jest.fn(),
    findProductInCart: jest.fn(),
    deleteProduct: jest.fn(),
    deleteProductsByCartId: jest.fn(),
  };
}

function makeCart(id = "cart-id", userId = "user-id"): CartEntity {
  return new CartEntity(id, userId);
}

function makeCartItem(
  id = "cart-item-id",
  productId = "product-id",
  quantity = 2,
  price = 10,
  cartId = "cart-id",
): CartItemsEntity {
  return new CartItemsEntity(id, productId, quantity, price, cartId);
}

describe("Cart use cases", () => {
  let repo: jest.Mocked<CartRepository>;

  beforeEach(() => {
    repo = makeRepo();
  });

  describe("CreateCartUseCase", () => {
    it("should return existing cart when user already has one", async () => {
      const cart = makeCart();
      repo.findOne.mockResolvedValue(cart);

      const result = await new CreateCartUseCase(repo).execute("user-id");

      expect(result).toBe(cart);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it("should create and save a cart when user has no cart", async () => {
      const savedCart = makeCart();
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue(savedCart);

      const result = await new CreateCartUseCase(repo).execute("user-id");

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(repo.save.mock.calls[0][0].getUserId()).toBe("user-id");
      expect(result).toBe(savedCart);
    });
  });

  describe("FindCartByIdUseCase", () => {
    it("should return cart when found and owned by user", async () => {
      const cart = makeCart();
      repo.findOne.mockResolvedValue(cart);

      const result = await new FindCartByIdUseCase(repo).execute(
        "cart-id",
        "user-id",
      );

      expect(result).toBe(cart);
    });

    it("should throw when cart is not found", async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        new FindCartByIdUseCase(repo).execute("cart-id", "user-id"),
      ).rejects.toThrow(CartNotFoundException);
    });

    it("should throw when user does not own cart", async () => {
      repo.findOne.mockResolvedValue(makeCart("cart-id", "owner-id"));

      await expect(
        new FindCartByIdUseCase(repo).execute("cart-id", "user-id"),
      ).rejects.toThrow(CartAccessDeniedException);
    });
  });

  describe("FindCartByUserIdUseCase", () => {
    it("should return cart by user id", async () => {
      const cart = makeCart();
      repo.findOne.mockResolvedValue(cart);

      await expect(
        new FindCartByUserIdUseCase(repo).execute("user-id"),
      ).resolves.toBe(cart);
    });
  });

  describe("AddProductToCartUseCase", () => {
    const data = {
      productId: "product-id",
      productName: "Product 1",
      quantity: 2,
      price: 10,
    };

    it("should add a new product to cart", async () => {
      const cart = makeCart();
      const updatedCart = makeCart();
      repo.findOne.mockResolvedValueOnce(cart).mockResolvedValueOnce(updatedCart);
      repo.saveProduct.mockImplementation(async (item) => item);

      const result = await new AddProductToCartUseCase(repo).execute(
        "cart-id",
        "user-id",
        data,
      );

      expect(repo.saveProduct).toHaveBeenCalledTimes(1);
      expect(repo.saveProduct.mock.calls[0][0].getProductId()).toBe(
        "product-id",
      );
      expect(repo.saveProduct.mock.calls[0][0].getQuantity()).toBe(2);
      expect(result).toBe(updatedCart);
    });

    it("should increase quantity when product already exists in cart", async () => {
      const cart = makeCart();
      const existing = makeCartItem("cart-item-id", "product-id", 3);
      cart.getCartItems().push(existing);
      const updatedCart = makeCart();
      repo.findOne.mockResolvedValueOnce(cart).mockResolvedValueOnce(updatedCart);
      repo.saveProduct.mockImplementation(async (item) => item);

      await new AddProductToCartUseCase(repo).execute(
        "cart-id",
        "user-id",
        data,
      );

      expect(repo.saveProduct.mock.calls[0][0].getId()).toBe("cart-item-id");
      expect(repo.saveProduct.mock.calls[0][0].getQuantity()).toBe(5);
    });

    it("should throw when cart is not found", async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        new AddProductToCartUseCase(repo).execute("cart-id", "user-id", data),
      ).rejects.toThrow(CartNotFoundException);
    });

    it("should throw when user does not own cart", async () => {
      repo.findOne.mockResolvedValue(makeCart("cart-id", "owner-id"));

      await expect(
        new AddProductToCartUseCase(repo).execute("cart-id", "user-id", data),
      ).rejects.toThrow(CartAccessDeniedException);
    });
  });

  describe("UpdateCartProductQuantityUseCase", () => {
    it("should update product quantity", async () => {
      const cart = makeCart();
      const item = makeCartItem();
      const updatedCart = makeCart();
      repo.findOne.mockResolvedValueOnce(cart).mockResolvedValueOnce(updatedCart);
      repo.findProductInCart.mockResolvedValue(item);
      repo.saveProduct.mockImplementation(async (product) => product);

      const result = await new UpdateCartProductQuantityUseCase(repo).execute(
        "cart-id",
        "product-id",
        "user-id",
        4,
      );

      expect(item.getQuantity()).toBe(4);
      expect(repo.saveProduct).toHaveBeenCalledWith(item);
      expect(result).toBe(updatedCart);
    });

    it("should throw when product is not in cart", async () => {
      repo.findOne.mockResolvedValue(makeCart());
      repo.findProductInCart.mockResolvedValue(null);

      await expect(
        new UpdateCartProductQuantityUseCase(repo).execute(
          "cart-id",
          "product-id",
          "user-id",
          4,
        ),
      ).rejects.toThrow(CartProductNotFoundException);
    });
  });

  describe("RemoveProductFromCartUseCase", () => {
    it("should remove product from cart", async () => {
      const cart = makeCart();
      const item = makeCartItem();
      const updatedCart = makeCart();
      repo.findOne.mockResolvedValueOnce(cart).mockResolvedValueOnce(updatedCart);
      repo.findProductInCart.mockResolvedValue(item);
      repo.deleteProduct.mockResolvedValue(true);

      const result = await new RemoveProductFromCartUseCase(repo).execute(
        "cart-id",
        "product-id",
        "user-id",
      );

      expect(repo.deleteProduct).toHaveBeenCalledWith("cart-item-id");
      expect(result).toBe(updatedCart);
    });

    it("should throw when product is not in cart", async () => {
      repo.findOne.mockResolvedValue(makeCart());
      repo.findProductInCart.mockResolvedValue(null);

      await expect(
        new RemoveProductFromCartUseCase(repo).execute(
          "cart-id",
          "product-id",
          "user-id",
        ),
      ).rejects.toThrow(CartProductNotFoundException);
    });
  });

  describe("DeleteCartUseCase", () => {
    it("should delete cart when user owns it", async () => {
      repo.findOne.mockResolvedValue(makeCart());
      repo.delete.mockResolvedValue(true);

      await expect(
        new DeleteCartUseCase(repo).execute("cart-id", "user-id"),
      ).resolves.toBe(true);
      expect(repo.delete).toHaveBeenCalledWith("cart-id");
    });

    it("should throw when cart is not found", async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        new DeleteCartUseCase(repo).execute("cart-id", "user-id"),
      ).rejects.toThrow(CartNotFoundException);
    });

    it("should throw when user does not own cart", async () => {
      repo.findOne.mockResolvedValue(makeCart("cart-id", "owner-id"));

      await expect(
        new DeleteCartUseCase(repo).execute("cart-id", "user-id"),
      ).rejects.toThrow(CartAccessDeniedException);
    });
  });
});
