jest.mock("../../../src/http/controllers/auth.controller", () => ({
  AuthController: {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock("../../../src/http/controllers/user.controller", () => ({
  UserController: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../../src/http/controllers/cart.controller", () => ({
  CartController: {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
    addProduct: jest.fn(),
    updateProductQuantity: jest.fn(),
    removeProduct: jest.fn(),
  },
}));

jest.mock("../../../src/http/controllers/middlewares/cart.middleware", () => ({
  CartMiddleware: jest.fn().mockImplementation(() => ({
    verifyToken: jest.fn(),
  })),
}));

import { AuthController } from "../../../src/http/controllers/auth.controller";
import { CartController } from "../../../src/http/controllers/cart.controller";
import { CartMiddleware } from "../../../src/http/controllers/middlewares/cart.middleware";
import { UserController } from "../../../src/http/controllers/user.controller";
import { authRouter } from "../../../src/router/auth-router";
import { cartRouter } from "../../../src/router/cart-router";
import { userRouter } from "../../../src/router/user-router";

function getRoutes(router: any) {
  return router.stack
    .filter((layer: any) => layer.route)
    .map((layer: any) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
      handlers: layer.route.stack.map((routeLayer: any) => routeLayer.handle),
    }));
}

describe("Routes", () => {
  it("should configure auth routes", () => {
    expect(getRoutes(authRouter)).toEqual([
      {
        path: "/login",
        methods: ["post"],
        handlers: [AuthController.login],
      },
      {
        path: "/refresh-token",
        methods: ["post"],
        handlers: [AuthController.refresh],
      },
      {
        path: "/logout",
        methods: ["post"],
        handlers: [AuthController.logout],
      },
    ]);
  });

  it("should configure user routes", () => {
    expect(getRoutes(userRouter)).toEqual([
      { path: "/", methods: ["post"], handlers: [UserController.create] },
      { path: "/", methods: ["get"], handlers: [UserController.findAll] },
      {
        path: "/search",
        methods: ["get"],
        handlers: [UserController.findByEmail],
      },
      { path: "/:id", methods: ["get"], handlers: [UserController.findById] },
      { path: "/:id", methods: ["put"], handlers: [UserController.update] },
      { path: "/:id", methods: ["delete"], handlers: [UserController.delete] },
    ]);
  });

  it("should configure cart middleware and routes", () => {
    const cartMiddlewareInstance = (CartMiddleware as jest.Mock).mock.results[0]
      .value;

    expect(cartRouter.stack[0].handle).toBe(
      cartMiddlewareInstance.verifyToken,
    );
    expect(getRoutes(cartRouter)).toEqual([
      { path: "/", methods: ["post"], handlers: [CartController.create] },
      { path: "/", methods: ["get"], handlers: [CartController.findByUserId] },
      { path: "/:id", methods: ["get"], handlers: [CartController.findById] },
      { path: "/:id", methods: ["delete"], handlers: [CartController.delete] },
      {
        path: "/:cartId/products",
        methods: ["post"],
        handlers: [CartController.addProduct],
      },
      {
        path: "/:cartId/products/:productId",
        methods: ["put"],
        handlers: [CartController.updateProductQuantity],
      },
      {
        path: "/:cartId/products/:productId",
        methods: ["delete"],
        handlers: [CartController.removeProduct],
      },
    ]);
  });
});
