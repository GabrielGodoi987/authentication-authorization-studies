import {
  CartIdCannotBeEmptyException,
  CartItemQuantityMustBePositiveException,
  CartProductCannotBeNullException,
  CartProductNotFoundException,
  CartUserIdCannotBeEmptyException,
} from "../../../../src/domain/domain-exceptions/cart.exceptions";
import { CartEntity } from "../../../../src/domain/entities/cart.entity";
import { ProductEntity } from "../../../../src/domain/entities/product.entity";

describe("CartEntity - unit test", () => {
  const validCart = {
    id: "cart-id",
    userId: "user-id",
  };

  const makeCart = () => new CartEntity(validCart.id, validCart.userId);
  const makeProduct = (id = "product-id", price = 10) =>
    new ProductEntity(id, "Product 1", price);

  it("should instantiate a valid cart", () => {
    const cart = makeCart();

    expect(cart.getId()).toBe(validCart.id);
    expect(cart.getUserId()).toBe(validCart.userId);
    expect(cart.getPrice()).toBe(0);
    expect(cart.getCartItems()).toEqual([]);
    expect(cart.toJSON()).toEqual({
      ...validCart,
      price: 0,
      products: [],
    });
  });

  it("should add a product and recalculate cart price", () => {
    const cart = makeCart();
    const product = makeProduct();

    cart.addProduct(product, 2);

    expect(cart.getCartItems()).toHaveLength(1);
    expect(cart.getPrice()).toBe(20);
    expect(cart.getTotalPrice()).toBe(20);
  });

  it("should increase quantity when adding the same product", () => {
    const cart = makeCart();
    const product = makeProduct();

    cart.addProduct(product, 2);
    cart.addProduct(product, 3);

    expect(cart.getCartItems()).toHaveLength(1);
    expect(cart.getCartItems()[0].getQuantity()).toBe(5);
    expect(cart.getPrice()).toBe(50);
  });

  it("should remove a product and recalculate cart price", () => {
    const cart = makeCart();
    const product = makeProduct();
    const secondProduct = makeProduct("product-id-2", 5);

    cart.addProduct(product, 2);
    cart.addProduct(secondProduct, 1);
    cart.removeProduct(product.getId());

    expect(cart.getCartItems()).toHaveLength(1);
    expect(cart.getCartItems()[0].getProductId()).toBe(secondProduct.getId());
    expect(cart.getPrice()).toBe(5);
  });

  it("should update product quantity and recalculate cart price", () => {
    const cart = makeCart();
    const product = makeProduct();

    cart.addProduct(product, 2);
    cart.updateProductQuantity(product.getId(), 4);

    expect(cart.getCartItems()[0].getQuantity()).toBe(4);
    expect(cart.getPrice()).toBe(40);
  });

  describe("cart validation", () => {
    it("should throw when id is empty", () => {
      expect(() => new CartEntity("", validCart.userId)).toThrow(
        CartIdCannotBeEmptyException,
      );
    });

    it("should throw when user id is empty", () => {
      expect(() => new CartEntity(validCart.id, "")).toThrow(
        CartUserIdCannotBeEmptyException,
      );
    });
  });

  describe("product operations validation", () => {
    it("should throw when product is null", () => {
      const cart = makeCart();

      expect(() => cart.addProduct(null as unknown as ProductEntity, 1)).toThrow(
        CartProductCannotBeNullException,
      );
    });

    it("should throw when adding product with invalid quantity", () => {
      const cart = makeCart();

      expect(() => cart.addProduct(makeProduct(), 0)).toThrow(
        CartItemQuantityMustBePositiveException,
      );
    });

    it("should throw when removing a product that is not in cart", () => {
      const cart = makeCart();

      expect(() => cart.removeProduct("unknown-product-id")).toThrow(
        CartProductNotFoundException,
      );
    });

    it("should throw when updating a product that is not in cart", () => {
      const cart = makeCart();

      expect(() => cart.updateProductQuantity("unknown-product-id", 2)).toThrow(
        CartProductNotFoundException,
      );
    });

    it("should throw when updating product quantity with invalid quantity", () => {
      const cart = makeCart();
      const product = makeProduct();

      cart.addProduct(product, 2);

      expect(() => cart.updateProductQuantity(product.getId(), 0)).toThrow(
        CartItemQuantityMustBePositiveException,
      );
    });
  });
});
