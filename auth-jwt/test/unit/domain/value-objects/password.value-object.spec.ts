import { InvalidPasswordError } from "../../../../src/domain/domain-exceptions/password.exception";
import { PasswordValueObject } from "../../../../src/domain/value-objects/password.value-object";
import { context } from "../../../helpers/context";

describe("PasswordValueObject - unit test", () => {
  it("should instantiate correctly when password is valid", () => {
    const password = new PasswordValueObject("StrongPass123");

    expect(password.getPassword()).toBe("StrongPass123");
  });

  context("Fail cases", () => {
    it("should throw InvalidPasswordError when password is less than 8 characters", () => {
      expect(() => new PasswordValueObject("Abc123")).toThrow(
        InvalidPasswordError,
      );
    });

    it("should throw InvalidPasswordError when password doesnt have upper case characters", () => {
      expect(() => new PasswordValueObject("strongpass123")).toThrow(
        InvalidPasswordError,
      );
    });

    it("should throw InvalidPasswordError when password doesnt have lower case characters", () => {
      expect(() => new PasswordValueObject("STRONGPASS123")).toThrow(
        InvalidPasswordError,
      );
    });

    it("should throw InvalidPasswordError when password doesnt have numbers", () => {
      expect(() => new PasswordValueObject("StrongPass")).toThrow(
        InvalidPasswordError,
      );
    });

    it("should throw InvalidPasswordError when password has special characters", () => {
      expect(() => new PasswordValueObject("StrongPass123!")).toThrow(
        InvalidPasswordError,
      );
    });
  });
});
