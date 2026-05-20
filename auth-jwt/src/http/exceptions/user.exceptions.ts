export class InvalidCredentialsExceptions extends Error {
  constructor(params?: { message: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid credentials", params?.options);
    this.name = "InvalidCredentialsExceptions";
  }
}

export class UserNotFoundException extends Error {
  constructor(params?: { message: string; options?: ErrorOptions }) {
    super(params?.message || "User not found", params?.options);
    this.name = "UserNotFoundExceptions";
  }
}

export class UserAlreadyExistsExceptions extends Error {
  constructor(params?: { message: string; options?: ErrorOptions }) {
    super(params?.message || "User already exists", params?.options);
    this.name = "UserAlreadyExistsExceptions";
  }
}
