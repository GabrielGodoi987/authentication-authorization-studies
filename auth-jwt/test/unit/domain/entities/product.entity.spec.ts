import {
  InvalidProductPriceException,
  ProductNameCannotBeEmptyException,
  ProductNameCannotBeNullException,
  ProductPriceCannotBeNegativeException,
} from "../../../../src/domain/domain-exceptions/product.exceptions";
import { ProductEntity } from "../../../../src/domain/entities/product.entity";
import { v4 } from "../../../__mocks__/uuid";

describe("ProductEntity - unit test", () => {
  const validProduct = {
    id: v4(),
    name: "Product 1",
    price: 10,
  };

  it("should instantiate a valid product", () => {
    const product = new ProductEntity(
      validProduct.id,
      validProduct.name,
      validProduct.price,
    );

    expect(product.getId()).toBe(validProduct.id);
    expect(product.getName()).toBe(validProduct.name);
    expect(product.getPrice()).toBe(validProduct.price);
    expect(product.toJSON()).toEqual(validProduct);
  });

  it("should generate an id when id is null", () => {
    const product = new ProductEntity(
      null,
      validProduct.name,
      validProduct.price,
    );

    expect(product.getId()).toBe(v4());
  });

  describe("name validation", () => {
    it("should throw when name is null", () => {
      expect(
        () =>
          new ProductEntity(
            validProduct.id,
            null as unknown as string,
            validProduct.price,
          ),
      ).toThrow(ProductNameCannotBeNullException);
    });

    it("should throw when name is empty", () => {
      expect(
        () => new ProductEntity(validProduct.id, "", validProduct.price),
      ).toThrow(ProductNameCannotBeEmptyException);
    });

    it("should throw when name has only spaces", () => {
      expect(
        () => new ProductEntity(validProduct.id, "   ", validProduct.price),
      ).toThrow(ProductNameCannotBeEmptyException);
    });

    it("should throw when setting an invalid name", () => {
      const product = new ProductEntity(
        validProduct.id,
        validProduct.name,
        validProduct.price,
      );

      expect(() => product.setName("")).toThrow(
        ProductNameCannotBeEmptyException,
      );
    });
  });

  describe("price validation", () => {
    it("should throw when price is invalid", () => {
      expect(
        () =>
          new ProductEntity(
            validProduct.id,
            validProduct.name,
            Number.NaN,
          ),
      ).toThrow(InvalidProductPriceException);
    });

    it("should throw when price is negative", () => {
      expect(
        () => new ProductEntity(validProduct.id, validProduct.name, -1),
      ).toThrow(ProductPriceCannotBeNegativeException);
    });

    it("should allow price zero", () => {
      const product = new ProductEntity(validProduct.id, validProduct.name, 0);

      expect(product.getPrice()).toBe(0);
    });

    it("should throw when setting an invalid price", () => {
      const product = new ProductEntity(
        validProduct.id,
        validProduct.name,
        validProduct.price,
      );

      expect(() => product.setPrice(-1)).toThrow(
        ProductPriceCannotBeNegativeException,
      );
    });
  });
});
