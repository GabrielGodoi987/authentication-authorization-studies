export class CartNotFoundException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Cart not found", params?.options);
    this.name = "CartNotFoundException";
  }
}

export class CartProductNotFoundException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Product not found in cart", params?.options);
    this.name = "CartProductNotFoundException";
  }
}

export class CartAccessDeniedException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "You do not have access to this cart",
      params?.options,
    );
    this.name = "CartAccessDeniedException";
  }
}
