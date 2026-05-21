import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../domain/repositorie/user.repository";
import { FindUserByEmailSpec } from "../domain/specifications/user.specifications";
import { InvalidTokenException } from "../http/exceptions/auth.exception";
import {
  InvalidCredentialsExceptions,
  UserNotFoundException,
} from "../http/exceptions/user.exceptions";
import { processEnv } from "../lib/consts";

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne(
        new FindUserByEmailSpec(email),
      );

      if (!user || !bcrypt.compareSync(password, user.getPassword())) {
        throw new InvalidCredentialsExceptions({
          message: "Invalid credentials",
          options: {
            cause: `User null: ${user} or credentials is not correct`,
          },
        });
      }

      const accessToken = this.generateAccessToken({
        name: user.getName(),
        email: user.getEmail(),
      });

      const refreshToken = this.generateRefreshToken({
        name: user.getName(),
        email: user.getEmail(),
      });

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw new InvalidTokenException({
        message: error.message,
        options: {
          cause: error,
        },
      });
    }
  }

  private generateAccessToken({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) {
    const accessToken = jwt.sign(
      { userName: name, userEmail: email },
      processEnv.JWTACCESSTOKENEXPIRESIN || "jesus_is_king",
      {
        expiresIn: "1h",
        algorithm: "HS256",
      },
    );
  }

  private generateRefreshToken({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) {
    const accessToken = jwt.sign(
      { userName: name, userEmail: email },
      processEnv.JWTREFRESHTOKENEXPIRESIN || "jesus_is_king",
      {
        expiresIn: "1h",
        algorithm: "HS256",
      },
    );
  }
}

export class AuthenticateUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  static verifyRefreshToken(token: string) {
    return jwt.sign(
      token,
      processEnv.JWTREFRESHTOKENEXPIRESIN as string,
    ) as unknown as {
      name: string;
      email: string;
      iat: number;
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = AuthenticateUsecase.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findOne(
      new FindUserByEmailSpec(payload.email),
    );
    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }
  }
}

export class RefreshTokenUseCase {
  async execute() {}
}
