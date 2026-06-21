export class ProductNameCannotBeNullException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Product name cannot be null", params?.options);
    this.name = "ProductNameCannotBeNullException";
  }
}

export class ProductNameCannotBeEmptyException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Product name cannot be empty", params?.options);
    this.name = "ProductNameCannotBeEmptyException";
  }
}

export class InvalidProductPriceException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid product price", params?.options);
    this.name = "InvalidProductPriceException";
  }
}

export class ProductPriceCannotBeNegativeException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Product price cannot be negative",
      params?.options,
    );
    this.name = "ProductPriceCannotBeNegativeException";
  }
}

export class ProductNotFoundException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Product was not found", params?.options);
    this.name = "ProductNotFoundException";
  }
}
