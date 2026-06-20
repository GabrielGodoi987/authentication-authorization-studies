import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserEntity } from "../domain/entities/user.entity";
import { UserRepository } from "../domain/repositories/user.repository";
import { FindUserByEmailSpec } from "../domain/specifications/user.specifications";
import {
  InvalidRefreshTokenException,
  InvalidTokenException,
} from "../http/exceptions/auth.exception";
import {
  InvalidCredentialsExceptions,
  TokenGenerationException,
  UserNotFoundException,
} from "../http/exceptions/user.exceptions";
import { processEnv } from "../lib/consts";

export class TokenProvider {
  public static generateAccessToken({
    id,
    name,
    email,
  }: {
    id: string;
    name: string;
    email: string;
  }): string {
    try {
      const signOptions: SignOptions = {
        expiresIn:
          processEnv.JWT_ACCESS_TOKEN_EXPIRESIN as SignOptions["expiresIn"],
        algorithm: "RS256",
        subject: id,
      };

      return jwt.sign(
        { userName: name, userEmail: email },
        processEnv.JWT_PRIVATE_KEY,
        signOptions,
      );
    } catch (error: any) {
      throw new TokenGenerationException({
        message: error.message,
        options: {
          cause: error,
        },
      });
    }
  }

  public static generateRefreshToken({
    id,
    name,
    email,
  }: {
    id: string;
    name: string;
    email: string;
  }): string {
    try {
      const signOptions: SignOptions = {
        expiresIn:
          processEnv.JWT_REFRESH_TOKEN_EXPIRESIN as SignOptions["expiresIn"],
        algorithm: "RS256",
        subject: id,
      };

      return jwt.sign(
        { userName: name, userEmail: email },
        processEnv.JWT_PRIVATE_KEY,
        signOptions,
      );
    } catch (error: any) {
      throw new TokenGenerationException({
        message: error.message,
        options: {
          cause: error,
        },
      });
    }
  }
}

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne(
        new FindUserByEmailSpec(email),
      );

      if (!user) {
        throw new InvalidCredentialsExceptions({
          message: "Invalid credentials",
          options: {
            cause: `User null: ${email} or credentials is not correct`,
          },
        });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.getPassword(),
      );

      if (!isValidPassword) {
        throw new InvalidCredentialsExceptions({
          message: "Credential error",
        });
      }

      const accessToken = TokenProvider.generateAccessToken({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      });

      const refreshToken = TokenProvider.generateRefreshToken({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      });

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      console.error(error);
      throw new InvalidTokenException({
        message: error.message,
        options: {
          cause: error,
        },
      });
    }
  }
}

export class RefreshTokenUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async refreshToken({ refreshToken }: { refreshToken: string }) {
    const { payload } = this.verifyAndValidateRefreshToken(refreshToken);
    const user = await this.verifyIfUserExists(payload.userEmail);

    const newAccessToken = TokenProvider.generateAccessToken({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    });

    const newRefreshToken = TokenProvider.generateRefreshToken({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    });

    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  private verifyAndValidateRefreshToken(token: string) {
    try {
      const payload = jwt.verify(token, processEnv.JWT_PUBLIC_KEY) as {
        userName: string;
        userEmail: string;
        sub: string;
        iat: number;
      };

      if (!payload) {
        throw new InvalidRefreshTokenException({
          message: "RefreshToken was invalid",
          options: {
            cause: payload,
          },
        });
      }

      return { payload };
    } catch (error: any) {
      throw new InvalidRefreshTokenException({
        message: error.message,
        options: {
          cause: error,
        },
      });
    }
  }

  private async verifyIfUserExists(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      new FindUserByEmailSpec(email),
    );

    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }

    return user;
  }
}
