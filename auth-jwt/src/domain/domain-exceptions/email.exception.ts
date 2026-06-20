export class InvalidEmailException extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid email format", params?.options);
    this.name = "InvalidEmailException";
  }
}
