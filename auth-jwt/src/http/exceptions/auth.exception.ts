export class InvalidTokenException extends Error {
  constructor(params?: { message: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid token", params?.options);
    this.name = "InvalidTokenException";
  }
}

export class MissingTokenException extends Error {
  constructor(params?: { message: string; options?: ErrorOptions }) {
    super(params?.message || "Missing token", params?.options);
    this.name = "MissingTokenException";
  }
}
