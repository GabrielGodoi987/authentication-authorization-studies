import { NextFunction, Request, Response } from "express";
import type { SwaggerController } from "../../docs/types";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
  UpdateUserUseCase,
} from "../../services/user.use-cases";

const userRepo = new UserRepositoryImpl();

const createUserUseCase = new CreateUserUseCase(userRepo);
const findUserByIdUseCase = new FindUserByIdUseCase(userRepo);
const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepo);
const findAllUsersUseCase = new FindAllUsersUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo);
const deleteUserUseCase = new DeleteUserUseCase(userRepo);

const UserResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

const ErrorResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

export class UserController {
  static swagger: SwaggerController = {
    tag: { name: "Users", description: "User management endpoints" },
    paths: {
      "/users": {
        post: {
          tags: ["Users"],
          summary: "Create a new user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "User created",
              content: { "application/json": { schema: UserResponseSchema } },
            },
            "500": {
              description: "Internal server error",
              content: { "application/json": { schema: ErrorResponseSchema } },
            },
          },
        },
        get: {
          tags: ["Users"],
          summary: "List all users",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Array of users",
              content: {
                "application/json": {
                  schema: { type: "array", items: UserResponseSchema },
                },
              },
            },
          },
        },
      },
      "/users/search": {
        get: {
          tags: ["Users"],
          summary: "Find user by email",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "email",
              in: "query",
              required: true,
              schema: { type: "string", format: "email" },
            },
          ],
          responses: {
            "200": {
              description: "User found",
              content: { "application/json": { schema: UserResponseSchema } },
            },
            "400": {
              description: "Missing email query parameter",
              content: { "application/json": { schema: ErrorResponseSchema } },
            },
            "404": {
              description: "User not found",
              content: { "application/json": { schema: ErrorResponseSchema } },
            },
          },
        },
      },
      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Find user by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "User found",
              content: { "application/json": { schema: UserResponseSchema } },
            },
            "404": {
              description: "User not found",
              content: { "application/json": { schema: ErrorResponseSchema } },
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update a user",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "User updated",
              content: { "application/json": { schema: UserResponseSchema } },
            },
            "404": {
              description: "User not found",
              content: { "application/json": { schema: ErrorResponseSchema } },
            },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete a user",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "204": { description: "User deleted, no content" },
            "404": {
              description: "User not found",
              content: { "application/json": { schema: ErrorResponseSchema } },
            },
          },
        },
      },
    },
  };

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await createUserUseCase.execute(req.body);
      res.status(201).json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await findAllUsersUseCase.execute();
      res.json(users.map((u) => u.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await findUserByIdUseCase.execute(req.params.id as string);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ message: "Email query parameter is required" });
        return;
      }
      const user = await findUserByEmailUseCase.execute(email);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await updateUserUseCase.execute(
        req.params.id as string,
        req.body,
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await deleteUserUseCase.execute(req.params.id as string);
      if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
