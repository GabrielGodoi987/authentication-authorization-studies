import { CartPersistenceEntity } from "../../../../src/infrastructure/persistence/cart-persistence.entity";
import {
  FindAllCartsSpec,
  FindCartByIdSpec,
  FindCartByUserIdSpec,
} from "../../../../src/domain/specifications/cart.specifications";

function makeCartPersistence(
  overrides: Partial<CartPersistenceEntity> = {},
): CartPersistenceEntity {
  return Object.assign(new CartPersistenceEntity(), {
    id: "cart-id",
    userId: "user-id",
    price: 10,
    cartItems: [],
    ...overrides,
  });
}

describe("Cart specifications", () => {
  describe("FindCartByIdSpec", () => {
    it("should match carts by id", () => {
      const spec = new FindCartByIdSpec("cart-id");

      expect(spec.isSatisfiedBy(makeCartPersistence())).toBe(true);
      expect(spec.isSatisfiedBy(makeCartPersistence({ id: "other-id" }))).toBe(
        false,
      );
    });

    it("should convert to where clause", () => {
      expect(new FindCartByIdSpec("cart-id").toWhere()).toEqual({
        id: "cart-id",
      });
    });
  });

  describe("FindCartByUserIdSpec", () => {
    it("should match carts by user id", () => {
      const spec = new FindCartByUserIdSpec("user-id");

      expect(spec.isSatisfiedBy(makeCartPersistence())).toBe(true);
      expect(
        spec.isSatisfiedBy(makeCartPersistence({ userId: "other-user-id" })),
      ).toBe(false);
    });

    it("should convert to where clause", () => {
      expect(new FindCartByUserIdSpec("user-id").toWhere()).toEqual({
        userId: "user-id",
      });
    });
  });

  describe("FindAllCartsSpec", () => {
    it("should match every cart", () => {
      const spec = new FindAllCartsSpec();

      expect(spec.isSatisfiedBy(makeCartPersistence())).toBe(true);
      expect(
        spec.isSatisfiedBy(
          makeCartPersistence({ id: "other-id", userId: "other-user-id" }),
        ),
      ).toBe(true);
    });

    it("should convert to an empty where clause", () => {
      expect(new FindAllCartsSpec().toWhere()).toEqual({});
    });
  });
});
