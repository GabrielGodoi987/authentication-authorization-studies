import { getMetadataArgsStorage } from "typeorm";
import { CartItemsPersistenceEntity } from "../../../../src/infrastructure/persistence/cart-items-persistence.entity";
import { CartPersistenceEntity } from "../../../../src/infrastructure/persistence/cart-persistence.entity";
import { ProductPersistenceEntity } from "../../../../src/infrastructure/persistence/product-persistence.entity";
import { UserPersistenceEntity } from "../../../../src/infrastructure/persistence/user-persistence.entity";

function getTableName(target: Function): string | undefined {
  return getMetadataArgsStorage().tables.find((table) => table.target === target)
    ?.name;
}

function getColumnNames(target: Function): string[] {
  return getMetadataArgsStorage()
    .columns.filter((column) => column.target === target)
    .map((column) => column.propertyName);
}

function getColumnOptions(target: Function, propertyName: string) {
  return getMetadataArgsStorage().columns.find(
    (column) =>
      column.target === target && column.propertyName === propertyName,
  )?.options;
}

function getRelationNames(target: Function): string[] {
  return getMetadataArgsStorage()
    .relations.filter((relation) => relation.target === target)
    .map((relation) => relation.propertyName);
}

describe("Persistence entities", () => {
  describe("UserPersistenceEntity", () => {
    it("should map to users table with expected columns", () => {
      expect(getTableName(UserPersistenceEntity)).toBe("users");
      expect(getColumnNames(UserPersistenceEntity)).toEqual(
        expect.arrayContaining(["name", "email", "password"]),
      );
    });

    it("should hash and compare password", async () => {
      const user = new UserPersistenceEntity();
      user.password = "StrongPassword123";

      await user.hashPassword();

      expect(user.password).not.toBe("StrongPassword123");
      expect(user.comparePassword("StrongPassword123")).toBe(true);
      expect(user.comparePassword("WrongPassword123")).toBe(false);
    });

    it("should serialize without password", () => {
      const user = Object.assign(new UserPersistenceEntity(), {
        id: "user-id",
        name: "John Doe",
        email: "john.doe@email.com",
        password: "hashed-password",
      });

      expect(user.toJSON()).toEqual({
        id: "user-id",
        name: "John Doe",
        email: "john.doe@email.com",
      });
    });
  });

  describe("CartPersistenceEntity", () => {
    it("should map to carts table with expected columns", () => {
      expect(getTableName(CartPersistenceEntity)).toBe("carts");
      expect(getColumnNames(CartPersistenceEntity)).toEqual(
        expect.arrayContaining(["userId", "price"]),
      );
      expect(getColumnOptions(CartPersistenceEntity, "price")).toMatchObject({
        type: "float",
        default: 0,
      });
    });

    it("should configure cartItems as a relation", () => {
      expect(getRelationNames(CartPersistenceEntity)).toContain("cartItems");
    });
  });

  describe("CartItemsPersistenceEntity", () => {
    it("should map to cart_items table with expected columns", () => {
      expect(getTableName(CartItemsPersistenceEntity)).toBe("cart_items");
      expect(getColumnNames(CartItemsPersistenceEntity)).toEqual(
        expect.arrayContaining(["cartId", "productId", "quantity", "value"]),
      );
      expect(
        getColumnOptions(CartItemsPersistenceEntity, "quantity"),
      ).toMatchObject({
        type: "int",
        default: 1,
      });
      expect(getColumnOptions(CartItemsPersistenceEntity, "value")).toMatchObject(
        {
          type: "float",
        },
      );
    });

    it("should configure cart and product relations", () => {
      expect(getRelationNames(CartItemsPersistenceEntity)).toEqual(
        expect.arrayContaining(["cart", "product"]),
      );
    });
  });

  describe("ProductPersistenceEntity", () => {
    it("should map to products table with expected columns", () => {
      expect(getTableName(ProductPersistenceEntity)).toBe("products");
      expect(getColumnNames(ProductPersistenceEntity)).toEqual(
        expect.arrayContaining(["name", "price"]),
      );
      expect(getColumnOptions(ProductPersistenceEntity, "price")).toMatchObject({
        type: "float",
      });
    });

    it("should configure cartItems as a relation", () => {
      expect(getRelationNames(ProductPersistenceEntity)).toContain("cartItems");
    });
  });
});
