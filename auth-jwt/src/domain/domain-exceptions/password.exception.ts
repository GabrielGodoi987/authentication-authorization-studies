export class InvalidPasswordError extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid password format", params?.options);
    this.name = "InvalidPasswordError";
  }
}
