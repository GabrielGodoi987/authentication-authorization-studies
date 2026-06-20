import { EmailValueObject } from "../value-objects/email.value-object";
import { PasswordValueObject } from "../value-objects/password.value-object";

export class UserEntity {
  private id: string;
  private name: string;
  private email: EmailValueObject;
  private password: PasswordValueObject;

  constructor(id: string, name: string, email: string, password: string) {
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
}
