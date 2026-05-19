import express from "express";
import "reflect-metadata";
import { buildSwaggerSpec, swaggerUi } from "./docs/swagger";
import { AuthController } from "./http/controllers/auth.controller";
import { AuthMiddleware } from "./http/controllers/middlewares/auth.middleware";
import { UserController } from "./http/controllers/user.controller";
import { authRouter } from "./router/auth-router";
import { userRouter } from "./router/user-router";
import { main } from "./webserver/server";

export const app = express();

const swaggerSpec = buildSwaggerSpec({
  controllers: [UserController.swagger, AuthController.swagger],
});
const authMiddleware = new AuthMiddleware();
app.use(authMiddleware.verifyToken);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Auth JWT API" });
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  },
);

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
