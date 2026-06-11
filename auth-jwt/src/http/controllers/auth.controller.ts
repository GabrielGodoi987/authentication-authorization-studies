import { NextFunction, Request, Response } from "express";
import type { SwaggerController } from "../../docs/types";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import { processEnv } from "../../lib/consts";
import {
  AuthUseCase,
  RefreshTokenUseCase,
} from "../../services/auth.use-cases";
import {
  InvalidTokenException,
  MissingTokenException,
} from "../exceptions/auth.exception";

const userRepo = new UserRepositoryImpl();
const authUseCase = new AuthUseCase(userRepo);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepo);

export class AuthController {
  static swagger: SwaggerController = {
    tag: { name: "Auth", description: "Authentication endpoints" },
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Authenticate a user and return a JWT token",
          security: [],
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
          security: [],
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

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { user, accessToken, refreshToken } = await authUseCase.execute(
        email,
        password,
      );

      generateAccessTokenCookie(res, accessToken);
      generateRefreshTokenCookie(res, refreshToken);

      res.status(200).json({
        user: user.toJSON(),
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error(error.message);
      next(error);
    }
  }

  public static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.body?.refreshToken ||
        req.headers.authorization?.replace("Bearer ", "") ||
        req.cookies?.refreshToken;

      if (!refreshToken) {
        res.json(
          new MissingTokenException({
            message: "Token is missing",
            options: {
              cause: "Refresh token was not send",
            },
          }),
        );
        return;
      }

      const { newAccessToken, newRefreshToken } =
        await refreshTokenUseCase.refreshToken({ refreshToken });

      generateAccessTokenCookie(res, newAccessToken);
      generateRefreshTokenCookie(res, newRefreshToken);

      res.status(200).json({
        newAccessToken,
        newRefreshToken,
      });
    } catch (error: any) {
      next(
        new InvalidTokenException({
          message: error.message,
          options: {
            cause: error,
          },
        }),
      );
      return;
    }
  }

  public static logout(req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(204).end();
  }
}

// TODO: move it to a specific file to manage it and create unit tests
export function generateAccessTokenCookie(res: Response, accessToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: processEnv.NODE_ENV === "production",
    sameSite: "none", // The application is cross-site
    maxAge: 60000, // 1 minuto
    path: "/", // It will be sent to all API addresses that I have
  });
}

export function generateRefreshTokenCookie(res: Response, accessToken: string) {
  res.cookie("refreshToken", accessToken, {
    httpOnly: true,
    secure: processEnv.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60000 * 60 * 10, // 10 hours
    path: "/refresh-token", // What address I need receive the refresh token? Here goes the same address
  });
}
