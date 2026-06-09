import { NextFunction, Request, Response } from "express";
import type { SwaggerController } from "../../docs/types";
import { CartRepositoryImpl } from "../../infrastructure/repositories/cart.repository";
import {
  AddProductToCartUseCase,
  CreateCartUseCase,
  DeleteCartUseCase,
  FindCartByIdUseCase,
  FindCartByUserIdUseCase,
  RemoveProductFromCartUseCase,
  UpdateCartProductQuantityUseCase,
} from "../../services/cart.use-cases";

const cartRepo = new CartRepositoryImpl();

const createCartUseCase = new CreateCartUseCase(cartRepo);
const findCartByIdUseCase = new FindCartByIdUseCase(cartRepo);
const findCartByUserIdUseCase = new FindCartByUserIdUseCase(cartRepo);
const addProductToCartUseCase = new AddProductToCartUseCase(cartRepo);
const updateCartProductQuantityUseCase = new UpdateCartProductQuantityUseCase(
  cartRepo,
);
const removeProductFromCartUseCase = new RemoveProductFromCartUseCase(cartRepo);
const deleteCartUseCase = new DeleteCartUseCase(cartRepo);

const CartResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    userId: { type: "string", format: "uuid" },
    price: { type: "number" },
    products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          cartId: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          productName: { type: "string" },
          quantity: { type: "integer" },
          price: { type: "number" },
          totalPrice: { type: "number" },
        },
      },
    },
  },
};

const ErrorResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

export class CartController {
  static swagger: SwaggerController = {
    tag: { name: "Cart", description: "Cart management endpoints" },
    paths: {
      "/cart": {
        post: {
          tags: ["Cart"],
          summary: "Create a new cart for the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            "201": {
              description: "Cart created",
              content: {
                "application/json": { schema: CartResponseSchema },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
        get: {
          tags: ["Cart"],
          summary: "Get the authenticated user's cart",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Cart found",
              content: {
                "application/json": { schema: CartResponseSchema },
              },
            },
            "404": {
              description: "Cart not found",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
      },
      "/cart/{id}": {
        get: {
          tags: ["Cart"],
          summary: "Find cart by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Cart found",
              content: {
                "application/json": { schema: CartResponseSchema },
              },
            },
            "404": {
              description: "Cart not found",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
        delete: {
          tags: ["Cart"],
          summary: "Delete a cart",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "204": { description: "Cart deleted, no content" },
            "404": {
              description: "Cart not found",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
      },
      "/cart/{cartId}/products": {
        post: {
          tags: ["Cart"],
          summary: "Add a product to the cart",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "cartId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productId", "productName", "quantity", "price"],
                  properties: {
                    productId: { type: "string", format: "uuid" },
                    productName: { type: "string" },
                    quantity: { type: "integer", minimum: 1 },
                    price: { type: "number", minimum: 0 },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Product added to cart",
              content: {
                "application/json": { schema: CartResponseSchema },
              },
            },
            "404": {
              description: "Cart not found",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
      },
      "/cart/{cartId}/products/{productId}": {
        put: {
          tags: ["Cart"],
          summary: "Update product quantity in cart",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "cartId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "productId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quantity"],
                  properties: {
                    quantity: { type: "integer", minimum: 1 },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Product quantity updated",
              content: {
                "application/json": { schema: CartResponseSchema },
              },
            },
            "404": {
              description: "Cart or product not found",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
        delete: {
          tags: ["Cart"],
          summary: "Remove a product from the cart",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "cartId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "productId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Product removed from cart",
              content: {
                "application/json": { schema: CartResponseSchema },
              },
            },
            "404": {
              description: "Cart or product not found",
              content: {
                "application/json": { schema: ErrorResponseSchema },
              },
            },
          },
        },
      },
    },
  };

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const cart = await createCartUseCase.execute(user.id);
      res.status(201).json(cart.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async findByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const cart = await findCartByUserIdUseCase.execute(user.id);
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      res.json(cart.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const cart = await findCartByIdUseCase.execute(
        req.params.id as string,
        user.id,
      );
      res.json(cart.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const cart = await addProductToCartUseCase.execute(
        req.params.cartId as string,
        user.id,
        req.body,
      );
      res.json(cart.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async updateProductQuantity(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user;
      const cart = await updateCartProductQuantityUseCase.execute(
        req.params.cartId as string,
        req.params.productId as string,
        user.id,
        req.body.quantity,
      );
      res.json(cart.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async removeProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const cart = await removeProductFromCartUseCase.execute(
        req.params.cartId as string,
        req.params.productId as string,
        user.id,
      );
      res.json(cart.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      await deleteCartUseCase.execute(req.params.id as string, user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
