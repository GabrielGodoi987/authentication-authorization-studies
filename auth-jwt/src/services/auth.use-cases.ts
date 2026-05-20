import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../domain/repositorie/user.repository";
import { FindUserByEmailSpec } from "../domain/specifications/user.specifications";
import { InvalidCredentialsExceptions } from "../http/exceptions/user.exceptions";

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(email: string, password: string) {
    const user = await this.userRepository.findOne(
      new FindUserByEmailSpec(email),
    );

    if (!user || !bcrypt.compareSync(password, user.getPassword())) {
      throw new InvalidCredentialsExceptions({
        message: "Invalid credentials",
      });
    }

    // Using HS256 algorithm by default, but you can specify others if needed
    const accessToken = jwt.sign(
      { userName: user.getName(), userEmail: user.getEmail() },
      process.env.JWT_SECRET || "jesus_is_king",
      {
        expiresIn: "1h",
      },
    );

    return { user, accessToken };
  }
}
