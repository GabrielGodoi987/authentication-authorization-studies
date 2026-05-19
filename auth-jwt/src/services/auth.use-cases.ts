import jwt from "jsonwebtoken";
import { UserRepository } from "../domain/repositorie/user.repository";
import { FindUserByEmailSpec } from "../domain/specifications/user.specifications";

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(email: string, password: string) {
    const user = await this.userRepository.findOne(
      new FindUserByEmailSpec(email),
    );

    if (!user || !user.comparePassword(password)) {
      throw new Error("Invalid credentials");
    }

    // Using HS256 algorithm by default, but you can specify others if needed
    const token = jwt.sign(
      { userName: user.getName(), userEmail: user.getEmail() },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "1h",
      },
    );

    return { user, token };
  }
}
