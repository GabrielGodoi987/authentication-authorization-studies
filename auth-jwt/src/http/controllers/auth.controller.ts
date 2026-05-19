import { NextFunction, Request, Response } from "express";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repository";
import { AuthUseCase } from "../../services/auth.use-cases";

const userRepo = new UserRepositoryImpl();
const authUseCase = new AuthUseCase(userRepo);

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authUseCase.execute(email, password);
      res.status(200).json({
        use: user.toJSON(),
        token,
      });
    } catch (error: any) {
      console.error(error.message);
      next(error);
    }
  }
}
