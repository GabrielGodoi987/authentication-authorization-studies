import { NextFunction, Request, Response } from "express";
import type { SwaggerController } from "../../docs/types";
import { EmailValueObject } from "../../domain/value-objects/email.value-objects";
import { PasswordValueObject } from "../../domain/value-objects/password.value-objects";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import { AuthUseCase, RefreshTokenUseCase } from "../../services/auth.use-cases";
import { InvalidTokenException, MissingTokenException } from "../exceptions/auth.exception";

const userRepo = new UserRepositoryImpl();
const authUseCase = new AuthUseCase(userRepo);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepo);

interface AuthRequestBody extends Request {
  body: {
    email: EmailValueObject,
    password: PasswordValueObject
  }
}

interface RefreshRequest extends Request {
  body: {
    refreshToken?: string,
  },
  headers: {
    authorization?: string,
  },
}

export class AuthController {
  static swagger: SwaggerController = {
    tag: { name: "Auth", description: "Authentication endpoints" },
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Authenticate a user and return a JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Authentication successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          name: { type: "string" },
                          email: { type: "string", format: "email" },
                        },
                      },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { message: { type: "string" } },
                  },
                },
              },
            },
          },
        },
      },
       "/auth/refresh-token": {
    post: {
      tags: ["Auth"],
      summary: "Refresh an expired JWT token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  example: "refresh.token.here",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example: "new.jwt.token",
                  },
                  refreshToken: {
                    type: "string",
                    example: "new.refresh.token",
                  },
                },
              },
            },
          },
        },

        "401": {
          description: "Invalid or expired refresh token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid refresh token",
                  },
                },
              },
            },
          },
        },

        "404": {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User not found",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
    },
  };

  public static async login(req: AuthRequestBody, res: Response, next: NextFunction) {
    try {
      const { email, password} = req.body;
      const { user, accessToken } = await authUseCase.execute(email.getEmail(), password.getPassword());
      res.status(200).json({
        user: user.toJSON(),
        accessToken,
      });
    } catch (error: any) {
      console.error(error.message);
      next(error);
    }
  }

  public static async refresh(req: RefreshRequest, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body?.refreshToken || req.headers.authorization?.replace("Bearer ", "");
      if (!refreshToken) {
        next(new MissingTokenException({
          message: "Token is missing",
          options: {
            cause: "Refresh token was not send"
          }
        }));
        return;
       }
      
      const { newAccessToken, newRefreshToken} = await refreshTokenUseCase.refreshToken({ refreshToken });
      
      res.status(200).json({
        newAccessToken,
        newRefreshToken,
      })
      
    } catch (error: any) {
      res.status(error.status).json({
        message: error.message
      });

      next(new InvalidTokenException({
        message: error.message,
        options: {
          cause: error
        }
      }));
      return;
    }
  }
}
