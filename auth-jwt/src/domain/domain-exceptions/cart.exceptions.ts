export class CartIdCannotBeEmptyException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Cart id cannot be empty", params?.options);
    this.name = "CartIdCannotBeEmptyException";
  }
}

export class CartUserIdCannotBeEmptyException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Cart user id cannot be empty", params?.options);
    this.name = "CartUserIdCannotBeEmptyException";
  }
}

export class CartProductCannotBeNullException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Cart product cannot be null", params?.options);
    this.name = "CartProductCannotBeNullException";
  }
}

export class CartProductNotFoundException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Cart product not found", params?.options);
    this.name = "CartProductNotFoundException";
  }
}

export class CartItemIdCannotBeEmptyException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Cart item id cannot be empty", params?.options);
    this.name = "CartItemIdCannotBeEmptyException";
  }
}

export class CartItemProductIdCannotBeEmptyException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Cart item product id cannot be empty",
      params?.options,
    );
    this.name = "CartItemProductIdCannotBeEmptyException";
  }
}

export class CartItemCartIdCannotBeEmptyException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Cart item cart id cannot be empty",
      params?.options,
    );
    this.name = "CartItemCartIdCannotBeEmptyException";
  }
}

export class InvalidCartItemQuantityException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid cart item quantity", params?.options);
    this.name = "InvalidCartItemQuantityException";
  }
}

export class CartItemQuantityMustBePositiveException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Cart item quantity must be positive",
      params?.options,
    );
    this.name = "CartItemQuantityMustBePositiveException";
  }
}

export class InvalidCartItemPriceException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid cart item price", params?.options);
    this.name = "InvalidCartItemPriceException";
  }
}

export class CartItemPriceCannotBeNegativeException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Cart item price cannot be negative",
      params?.options,
    );
    this.name = "CartItemPriceCannotBeNegativeException";
  }
}
