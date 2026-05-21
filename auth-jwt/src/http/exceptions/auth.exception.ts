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


export class InvalidRefreshTokenException extends Error{
    constructor(params?: { message: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid refresh token", params?.options);
    this.name = "InvalidRefreshTokenException";
  }
}