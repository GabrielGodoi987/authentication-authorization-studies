import { v4 } from "uuid";
import { EmailValueObject } from "../value-objects/email.value-objects";
import { PasswordValueObject } from "../value-objects/password.value-objects";

export class UserEntity {
  private id: string;
  private name: string;
  private email: EmailValueObject;
  private password: string;

  private constructor(
    id: string,
    name: string,
    email: string,
    password: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = new EmailValueObject(email);
    this.password = password;
  }

  static create(name: string, email: string, password: string): UserEntity {
    const validated = new PasswordValueObject(password);
    return new UserEntity(v4(), name, email, validated.getPassword());
  }

  static fromPersistence(
    id: string,
    name: string,
    email: string,
    password: string,
  ): UserEntity {
    return new UserEntity(id, name, email, password);
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
    return this.password;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getEmail(),
    };
  }
}
