import { Router } from "express";
import { ProductController } from "../http/controllers/product.controller";

export const productRouter = Router();

productRouter.get("/", ProductController.findAll);
productRouter.get("/:id", ProductController.findOne);
productRouter.post("/", ProductController.create);
productRouter.put("/:id", ProductController.update);
productRouter.delete("/:id", ProductController.delete);
