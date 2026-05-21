import { config } from "dotenv";
import express, { Request, Response } from "express";
import "reflect-metadata";
import { buildSwaggerSpec, swaggerUi } from "./docs/swagger";
import { AuthController } from "./http/controllers/auth.controller";
import { AuthMiddleware } from "./http/controllers/middlewares/auth.middleware";
import { UserController } from "./http/controllers/user.controller";
import { processEnv } from "./lib/consts";
import { authRouter } from "./router/auth-router";
import { userRouter } from "./router/user-router";
import { main } from "./webserver/server";

config({
  debug: true,
  processEnv: processEnv,
});

export const app = express();

const swaggerSpec = buildSwaggerSpec({
  controllers: [UserController.swagger, AuthController.swagger],
});
const authMiddleware = new AuthMiddleware();
app.use(authMiddleware.verifyToken);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the Auth JWT API" });
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
  ) => {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  },
);

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
