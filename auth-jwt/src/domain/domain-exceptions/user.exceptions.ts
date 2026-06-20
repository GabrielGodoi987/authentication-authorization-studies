export class NameCannotBeEmptyError extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Name cannot be empty", params?.options);
    this.name = "NameCannotBeEmptyError";
  }
}

export class NameInvalidLentghtError extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(params?.message || "Invalid name length", params?.options);
    this.name = "NameInvalidLentghtError";
  }
}

export class InvalidCharacteresError extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Invalid characters are not allowed",
      params?.options,
    );
    this.name = "InvalidCharacteresError";
  }
}

export class InvalidPatternsError extends Error {
  constructor(params?: { message?: string; options?: ErrorOptions }) {
    super(
      params?.message || "Invalid patterns are not allowed",
      params?.options,
    );
    this.name = "InvalidPatternsError";
  }
}
