import {
  ExpiredTokenException,
  InvalidRefreshTokenException,
  InvalidTokenException,
  MissingTokenException,
} from "../../../../src/http/exceptions/auth.exception";

describe("Auth HTTP exceptions", () => {
  it.each([
    [InvalidTokenException, "InvalidTokenException", "Invalid token"],
    [MissingTokenException, "MissingTokenException", "Missing token"],
    [
      InvalidRefreshTokenException,
      "InvalidRefreshTokenException",
      "Invalid refresh token",
    ],
    [ExpiredTokenException, "ExpiredTokenException", "Expired token"],
  ])("should create %s with default message", (ExceptionClass, name, message) => {
    const exception = new ExceptionClass();

    expect(exception).toBeInstanceOf(Error);
    expect(exception.name).toBe(name);
    expect(exception.message).toBe(message);
  });

  it("should accept a custom message and cause", () => {
    const cause = new Error("cause");
    const exception = new InvalidTokenException({
      message: "Custom message",
      options: { cause },
    });

    expect(exception.message).toBe("Custom message");
    expect(exception.cause).toBe(cause);
  });
});
