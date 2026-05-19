import { NextFunction, Request, Response } from "express";
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

export class UserController {
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
      const user = await updateUserUseCase.execute(req.params.id as string, req.body);
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
