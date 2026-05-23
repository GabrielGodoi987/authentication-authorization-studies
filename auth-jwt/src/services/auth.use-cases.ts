import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserEntity } from "../domain/entities/user.entity";
import { UserRepository } from "../domain/repositorie/user.repository";
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
          processEnv.JWTACCESSTOKENEXPIRESIN as SignOptions["expiresIn"],
        algorithm: "HS256",
        subject: id,
      };

      return jwt.sign(
        { userName: name, userEmail: email },
        processEnv.JWT_SECRET,
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
          processEnv.JWTREFRESHTOKENEXPIRESIN as SignOptions["expiresIn"],
        algorithm: "HS256",
        subject: id,
      };
      return jwt.sign(
        { userName: name, userEmail: email },
        processEnv.JWT_SECRET,
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

      if (!user || !bcrypt.compareSync(password, user.getPassword())) {
        throw new InvalidCredentialsExceptions({
          message: "Invalid credentials",
          options: {
            cause: `User null: ${user} or credentials is not correct`,
          },
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
      console.log(error);
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
      const payload = jwt.verify(token, processEnv.JWT_SECRET) as {
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
