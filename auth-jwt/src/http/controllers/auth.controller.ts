import { NextFunction, Request, Response } from "express";
import type { SwaggerController } from "../../docs/types";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import { AuthUseCase } from "../../services/auth.use-cases";

const userRepo = new UserRepositoryImpl();
const authUseCase = new AuthUseCase(userRepo);

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
    },
  };

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, accessToken } = await authUseCase.execute(email, password);
      res.status(200).json({
        user: user.toJSON(),
        accessToken,
      });
    } catch (error: any) {
      console.error(error.message);
      next(error);
    }
  }
}
