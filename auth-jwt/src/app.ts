import express from "express";
import "reflect-metadata";
import { buildSwaggerSpec, swaggerUi } from "./docs/swagger";
import { UserController } from "./http/controllers/user.controller";
import { AuthController } from "./http/controllers/auth.controller";
import { authRouter } from "./router/auth-router";
import { userRouter } from "./router/user-router";

export const app = express();

const swaggerSpec = buildSwaggerSpec({
  controllers: [UserController.swagger, AuthController.swagger],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
});
