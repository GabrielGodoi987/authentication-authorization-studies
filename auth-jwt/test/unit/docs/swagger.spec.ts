import { buildSwaggerSpec } from "../../../src/docs/swagger";

describe("buildSwaggerSpec", () => {
  const mockController = {
    tag: { name: "Test", description: "Test controller" },
    paths: {
      "/test": {
        get: { summary: "Test endpoint" },
      },
    },
  };

  it("returns a valid OpenAPI 3.0 spec with default metadata", () => {
    const spec = buildSwaggerSpec({ controllers: [mockController] });

    expect(spec.openapi).toBe("3.0.0");
    expect(spec.info.title).toBe("Auth JWT API");
    expect(spec.info.version).toBe("1.0.0");
    expect(spec.servers).toEqual([{ url: "/", description: "Local server" }]);
  });

  it("merges paths from all controllers", () => {
    const controller2 = {
      tag: { name: "Test2", description: "Another controller" },
      paths: {
        "/another": {
          post: { summary: "Another endpoint" },
        },
      },
    };

    const spec = buildSwaggerSpec({ controllers: [mockController, controller2] });

    expect(spec.paths["/test"]).toBeDefined();
    expect(spec.paths["/another"]).toBeDefined();
    expect(Object.keys(spec.paths)).toHaveLength(2);
  });

  it("collects tags from controllers", () => {
    const spec = buildSwaggerSpec({ controllers: [mockController] });

    expect(spec.tags).toEqual([{ name: "Test", description: "Test controller" }]);
  });

  it("includes bearerAuth and apiKey security schemes", () => {
    const spec = buildSwaggerSpec({ controllers: [mockController] });

    expect(spec.components.securitySchemes.bearerAuth).toEqual({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "JWT token obtained from login endpoint",
    });
    expect(spec.components.securitySchemes.arguments).toEqual({
      type: "apiKey",
      in: "header",
      name: "x-api-token",
      description: "API token for accessing protected endpoints",
    });
  });

  it("includes default security requirement with bearerAuth", () => {
    const spec = buildSwaggerSpec({ controllers: [mockController] });

    expect(spec.security).toEqual([{ bearerAuth: [] }]);
  });

  it("includes custom schemas when provided", () => {
    const schemas = { User: { type: "object", properties: { name: { type: "string" } } } };
    const spec = buildSwaggerSpec({ controllers: [mockController], schemas });

    expect(spec.components.schemas).toEqual(schemas);
  });

  it("defaults schemas to empty object when not provided", () => {
    const spec = buildSwaggerSpec({ controllers: [mockController] });

    expect(spec.components.schemas).toEqual({});
  });
});
