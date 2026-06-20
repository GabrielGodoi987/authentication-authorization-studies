import {
  CartAccessDeniedException,
  CartNotFoundException,
  CartProductNotFoundException,
} from "../../../../src/http/exceptions/cart.exception";

describe("Cart HTTP exceptions", () => {
  it.each([
    [CartNotFoundException, "CartNotFoundException", "Cart not found"],
    [
      CartProductNotFoundException,
      "CartProductNotFoundException",
      "Product not found in cart",
    ],
    [
      CartAccessDeniedException,
      "CartAccessDeniedException",
      "You do not have access to this cart",
    ],
  ])("should create %s with default message", (ExceptionClass, name, message) => {
    const exception = new ExceptionClass();

    expect(exception).toBeInstanceOf(Error);
    expect(exception.name).toBe(name);
    expect(exception.message).toBe(message);
  });

  it("should accept a custom message", () => {
    const exception = new CartNotFoundException({
      message: "Missing cart",
    });

    expect(exception.message).toBe("Missing cart");
  });
});
