import {
  InvalidCharacteresError,
  InvalidPatternsError,
  NameCannotBeEmptyError,
  NameInvalidLentghtError,
} from "../domain-exceptions/user.exceptions";
import { EmailValueObject } from "../value-objects/email.value-object";
import { PasswordValueObject } from "../value-objects/password.value-object";

export class UserEntity {
  private id: string;
  private name: string;
  private email: EmailValueObject;
  private password: PasswordValueObject;

  constructor(id: string, name: string, email: string, password: string) {
    this.validateName({ name });
    this.id = id;
    this.name = name;
    this.email = new EmailValueObject(email);
    this.password = new PasswordValueObject(password);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email.getEmail();
  }

  getPassword(): string {
    return this.password.getPassword();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getEmail(),
    };
  }

  private validateName({ name }: { name: string }) {
    if (!name || name.trim() === "") {
      throw new NameCannotBeEmptyError({
        message: "Name cannot be empty",
      });
    }

    if (name.length < 5 || name.length > 50) {
      throw new NameInvalidLentghtError({
        message: "Name has to be between 5 and 50 characteres",
      });
    }

    const dangerousChars = /[<|>]/g;

    if (dangerousChars.test(name)) {
      throw new InvalidCharacteresError({
        message: "Validation Failed: Invalid characters detected.",
      });
    }

    const validPattern = /^[a-zA-Z0-9\s]+$/;

    if (!validPattern.test(name)) {
      throw new InvalidPatternsError({
        message:
          "Validation Failed: String contains invalid patterns or symbols.",
      });
    }
  }
}
