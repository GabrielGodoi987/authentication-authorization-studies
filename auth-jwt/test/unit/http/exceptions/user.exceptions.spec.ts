import {
  InvalidCredentialsExceptions,
  TokenGenerationException,
  UserAlreadyExistsExceptions,
  UserNotFoundException,
} from "../../../../src/http/exceptions/user.exceptions";

describe("User HTTP exceptions", () => {
  it.each([
    [
      InvalidCredentialsExceptions,
      "InvalidCredentialsExceptions",
      "Invalid credentials",
    ],
    [UserNotFoundException, "UserNotFoundExceptions", "User not found"],
    [
      UserAlreadyExistsExceptions,
      "UserAlreadyExistsExceptions",
      "User already exists",
    ],
    [
      TokenGenerationException,
      "TokenGenerationException",
      "Error when generating token",
    ],
  ])("should create %s with default message", (ExceptionClass, name, message) => {
    const exception = new ExceptionClass();

    expect(exception).toBeInstanceOf(Error);
    expect(exception.name).toBe(name);
    expect(exception.message).toBe(message);
  });

  it("should accept a custom message", () => {
    const exception = new UserNotFoundException({
      message: "User was not found",
    });

    expect(exception.message).toBe("User was not found");
  });
});
