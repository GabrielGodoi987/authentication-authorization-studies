import { Router } from "express";
import { AuthController } from "../http/controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/refresh-token", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);
