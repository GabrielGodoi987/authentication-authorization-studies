import { UserEntity } from "../../../../src/domain/entities/user.entity";
import { v4 } from "../../../__mocks__/uuid";

import { InvalidEmailException } from "../../../../src/domain/domain-exceptions/email.exception";
import { InvalidPasswordError } from "../../../../src/domain/domain-exceptions/password.exception";
import {
  InvalidCharacteresError,
  InvalidPatternsError,
  NameCannotBeEmptyError,
  NameInvalidLentghtError,
} from "../../../../src/domain/domain-exceptions/user.exceptions";

describe("UserEntity", () => {
  const validUser = {
    id: v4(),
    name: "John Doe",
    email: "john.doe@email.com",
    password: "StrongValidPassword12",
  };

  it("should instantiate a valid user", () => {
    const user = new UserEntity(
      validUser.id,
      validUser.name,
      validUser.email,
      validUser.password,
    );

    expect(user.getId()).toBe(validUser.id);

    expect(user.toJSON()).toEqual({
      id: validUser.id,
      name: validUser.name,
      email: validUser.email,
    });
  });

  describe("email validation", () => {
    it("should throw when email is invalid", () => {
      expect(
        () =>
          new UserEntity(
            validUser.id,
            validUser.name,
            "invalid-email",
            validUser.password,
          ),
      ).toThrow(InvalidEmailException);
    });
  });

  describe("password validation", () => {
    it("should throw when password is invalid", () => {
      expect(
        () =>
          new UserEntity(validUser.id, validUser.name, validUser.email, "123"),
      ).toThrow(InvalidPasswordError);
    });
  });

  describe("name validation", () => {
    it("should throw when name is empty", () => {
      expect(
        () =>
          new UserEntity(validUser.id, "", validUser.email, validUser.password),
      ).toThrow(NameCannotBeEmptyError);
    });

    it("should throw when name length is invalid", () => {
      expect(
        () =>
          new UserEntity(
            validUser.id,
            "abc",
            validUser.email,
            validUser.password,
          ),
      ).toThrow(NameInvalidLentghtError);
    });

    it("should throw when name contains dangerous characters", () => {
      expect(
        () =>
          new UserEntity(
            validUser.id,
            "John <Doe>",
            validUser.email,
            validUser.password,
          ),
      ).toThrow(InvalidCharacteresError);
    });

    it("should throw when name contains invalid patterns", () => {
      expect(
        () =>
          new UserEntity(
            validUser.id,
            "John@Doe",
            validUser.email,
            validUser.password,
          ),
      ).toThrow(InvalidPatternsError);
    });
  });
});
