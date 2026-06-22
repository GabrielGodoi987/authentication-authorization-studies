import CookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { buildSwaggerSpec, swaggerUi } from "./docs/swagger";
import { AuthController } from "./http/controllers/auth.controller";
import { CartController } from "./http/controllers/cart.controller";
import { ApiTokenMiddleware } from "./http/controllers/middlewares/api-token.middleware";
import { AuthMiddleware } from "./http/controllers/middlewares/auth.middleware";
import { CartMiddleware } from "./http/controllers/middlewares/cart.middleware";
import { UserController } from "./http/controllers/user.controller";
import { authRouter } from "./router/auth-router";
import { cartRouter } from "./router/cart-router";
import { productRouter } from "./router/product-router";
import { userRouter } from "./router/user-router";
import { main } from "./webserver/server";

export const app = express();

const swaggerSpec = buildSwaggerSpec({
  controllers: [
    UserController.swagger,
    AuthController.swagger,
    CartController.swagger,
  ],
});

app.use(express.json());
app.use(CookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

const apiTokenMiddleware = new ApiTokenMiddleware();
const cartMiddleware = new CartMiddleware();
const authMiddleware = new AuthMiddleware();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the Auth JWT API" });
});

app.use(apiTokenMiddleware.verifyApiToken);
app.use(authMiddleware.verifyToken);
app.use(cartMiddleware.verifyToken);

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
});

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
