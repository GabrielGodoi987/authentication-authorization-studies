import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { userRouter } from "./router/user-router";

export const app = express();

app.use(express.json());

app.use("/users", userRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
});
