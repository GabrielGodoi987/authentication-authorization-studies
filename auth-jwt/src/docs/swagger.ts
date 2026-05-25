import swaggerUi from "swagger-ui-express";
import type { SwaggerSpecOptions } from "./types";

export function buildSwaggerSpec({ controllers, schemas }: SwaggerSpecOptions) {
  const paths: Record<string, any> = {};

  for (const ctrl of controllers) {
    Object.assign(paths, ctrl.paths);
  }

  return {
    openapi: "3.0.0",
    info: {
      title: "Auth JWT API",
      version: "1.0.0",
      description: "Authentication and authorization API with JWT",
    },
    servers: [{ url: "/", description: "Local server" }],
    tags: controllers.map((c) => c.tag),
    paths,
    components: {
      schemas: schemas ?? {},
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token obtained from login endpoint",
        },
        arguments: {
          type: "apiKey",
          in: "header",
          name: "x-api-token",
          description: "API token for accessing protected endpoints",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
}

export function swaggerServe(setup: ReturnType<typeof buildSwaggerSpec>) {
  return swaggerUi.setup(setup);
}

export { swaggerUi };
