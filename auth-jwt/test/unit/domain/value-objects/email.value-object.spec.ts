import { EmailValueObject } from "../../../../src/domain/value-objects/email.value-object";

describe("EmailValueObject", () => {
  it("should validate email format", () => {
    const valueObject = new EmailValueObject("gabrielgodoi@gmail.com");

    expect(valueObject.getEmail()).toBe("gabrielgodoi@gmail.com");
  });

  it.only("should throw an error when it is not a valid format", () => {
    expect(() => new EmailValueObject("gb.com")).toThrow(
      "Invalid email format",
    );

    expect(() => new EmailValueObject("gabriel.com")).toThrow(
      "Invalid email format",
    );

    expect(() => new EmailValueObject("gabriel@.com")).toThrow(
      "Invalid email format",
    );
  });
});
