export class EmailValueObject {
  private readonly email: string;

  constructor(email: string) {
    if (!this.validateEmail(email)) {
      throw new Error("Invalid email format");
    }
    this.email = email;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getEmail(): string {
    return this.email;
  }
}
