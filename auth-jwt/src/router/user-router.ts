import { Router } from "express";
import { UserController } from "../http/controllers/user.controller";

export const userRouter = Router();

userRouter.post("/", UserController.create);
userRouter.get("/", UserController.findAll);
userRouter.get("/search", UserController.findByEmail);
userRouter.get("/:id", UserController.findById);
userRouter.put("/:id", UserController.update);
userRouter.delete("/:id", UserController.delete);
