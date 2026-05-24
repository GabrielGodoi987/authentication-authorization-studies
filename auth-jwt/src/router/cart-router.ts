import { Router } from "express";
import { CartController } from "../http/controllers/cart.controller";
import { CartMiddleware } from "../http/controllers/middlewares/cart.middleware";

export const cartRouter = Router();
const cartMiddleware = new CartMiddleware();

cartRouter.use(cartMiddleware.verifyToken);

cartRouter.post("/", CartController.create);
cartRouter.get("/", CartController.findByUserId);
cartRouter.get("/:id", CartController.findById);
cartRouter.delete("/:id", CartController.delete);
cartRouter.post("/:cartId/products", CartController.addProduct);
cartRouter.put("/:cartId/products/:productId", CartController.updateProductQuantity);
cartRouter.delete("/:cartId/products/:productId", CartController.removeProduct);
