import { InvalidPasswordError } from "../domain-exceptions/password.exception";

export class PasswordValueObject {
  private readonly password: string;

  constructor(password: string) {
    if (!this.validatePassword(password)) {
      throw new InvalidPasswordError({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }
    this.password = password;
  }

  private validatePassword(password: string): boolean {
    if (password.startsWith("$2b$") || password.startsWith("$2a$")) {
      return true;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  public getPassword(): string {
    return this.password;
  }
}
