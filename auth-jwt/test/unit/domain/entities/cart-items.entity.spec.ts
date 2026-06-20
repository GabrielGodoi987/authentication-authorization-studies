import {
  CartItemCartIdCannotBeEmptyException,
  CartItemIdCannotBeEmptyException,
  CartItemPriceCannotBeNegativeException,
  CartItemProductIdCannotBeEmptyException,
  CartItemQuantityMustBePositiveException,
  InvalidCartItemPriceException,
  InvalidCartItemQuantityException,
} from "../../../../src/domain/domain-exceptions/cart.exceptions";
import { CartItemsEntity } from "../../../../src/domain/entities/cart-items.entity";
import { v4 } from "../../../__mocks__/uuid";

describe("CartItemsEntity - unit test", () => {
  const validCartItem = {
    id: v4(),
    productId: "product-id",
    quantity: 2,
    unitPrice: 10,
    cartId: "cart-id",
  };

  it("should instantiate a valid cart item", () => {
    const cartItem = new CartItemsEntity(
      validCartItem.id,
      validCartItem.productId,
      validCartItem.quantity,
      validCartItem.unitPrice,
      validCartItem.cartId,
    );

    expect(cartItem.getId()).toBe(validCartItem.id);
    expect(cartItem.getProductId()).toBe(validCartItem.productId);
    expect(cartItem.getQuantity()).toBe(validCartItem.quantity);
    expect(cartItem.getUnitPrice()).toBe(validCartItem.unitPrice);
    expect(cartItem.getCartId()).toBe(validCartItem.cartId);
    expect(cartItem.getValue()).toBe(20);
    expect(cartItem.toJSON()).toEqual({
      id: validCartItem.id,
      productId: validCartItem.productId,
      quantity: validCartItem.quantity,
      unitPrice: validCartItem.unitPrice,
      value: 20,
    });
  });

  it("should generate an id when id is null", () => {
    const cartItem = new CartItemsEntity(
      null,
      validCartItem.productId,
      validCartItem.quantity,
      validCartItem.unitPrice,
      validCartItem.cartId,
    );

    expect(cartItem.getId()).toBe(v4());
  });

  it("should update value when quantity changes", () => {
    const cartItem = new CartItemsEntity(
      validCartItem.id,
      validCartItem.productId,
      validCartItem.quantity,
      validCartItem.unitPrice,
      validCartItem.cartId,
    );

    cartItem.setQuantity(3);

    expect(cartItem.getQuantity()).toBe(3);
    expect(cartItem.getValue()).toBe(30);
  });

  it("should update value when unit price changes", () => {
    const cartItem = new CartItemsEntity(
      validCartItem.id,
      validCartItem.productId,
      validCartItem.quantity,
      validCartItem.unitPrice,
      validCartItem.cartId,
    );

    cartItem.setPrice(15);

    expect(cartItem.getUnitPrice()).toBe(15);
    expect(cartItem.getValue()).toBe(30);
  });

  describe("id validation", () => {
    it("should throw when id is empty", () => {
      expect(
        () =>
          new CartItemsEntity(
            "",
            validCartItem.productId,
            validCartItem.quantity,
            validCartItem.unitPrice,
            validCartItem.cartId,
          ),
      ).toThrow(CartItemIdCannotBeEmptyException);
    });
  });

  describe("product id validation", () => {
    it("should throw when product id is empty", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            "",
            validCartItem.quantity,
            validCartItem.unitPrice,
            validCartItem.cartId,
          ),
      ).toThrow(CartItemProductIdCannotBeEmptyException);
    });
  });

  describe("cart id validation", () => {
    it("should throw when cart id is empty", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            validCartItem.productId,
            validCartItem.quantity,
            validCartItem.unitPrice,
            "",
          ),
      ).toThrow(CartItemCartIdCannotBeEmptyException);
    });
  });

  describe("quantity validation", () => {
    it("should throw when quantity is invalid", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            validCartItem.productId,
            Number.NaN,
            validCartItem.unitPrice,
            validCartItem.cartId,
          ),
      ).toThrow(InvalidCartItemQuantityException);
    });

    it("should throw when quantity is decimal", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            validCartItem.productId,
            1.5,
            validCartItem.unitPrice,
            validCartItem.cartId,
          ),
      ).toThrow(InvalidCartItemQuantityException);
    });

    it("should throw when quantity is zero or negative", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            validCartItem.productId,
            0,
            validCartItem.unitPrice,
            validCartItem.cartId,
          ),
      ).toThrow(CartItemQuantityMustBePositiveException);
    });
  });

  describe("price validation", () => {
    it("should throw when price is invalid", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            validCartItem.productId,
            validCartItem.quantity,
            Number.NaN,
            validCartItem.cartId,
          ),
      ).toThrow(InvalidCartItemPriceException);
    });

    it("should throw when price is negative", () => {
      expect(
        () =>
          new CartItemsEntity(
            validCartItem.id,
            validCartItem.productId,
            validCartItem.quantity,
            -1,
            validCartItem.cartId,
          ),
      ).toThrow(CartItemPriceCannotBeNegativeException);
    });
  });
});
