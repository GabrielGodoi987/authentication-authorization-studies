import { SwaggerController, SwaggerSpecOptions } from "../../../src/docs/types";

describe("Swagger types", () => {
  it("SwaggerController interface shape is usable at runtime", () => {
    const controller: SwaggerController = {
      tag: { name: "Test", description: "Test controller" },
      paths: {
        "/test": {
          get: { summary: "Test endpoint" },
        },
      },
    };

    expect(controller.tag.name).toBe("Test");
    expect(controller.tag.description).toBe("Test controller");
    expect(controller.paths["/test"].get.summary).toBe("Test endpoint");
  });

  it("SwaggerSpecOptions interface shape is usable at runtime", () => {
    const options: SwaggerSpecOptions = {
      controllers: [],
      schemas: { User: { type: "object" } },
    };

    expect(options.controllers).toEqual([]);
    expect(options.schemas).toEqual({ User: { type: "object" } });
  });

  it("SwaggerSpecOptions schemas is optional and defaults gracefully", () => {
    const options: SwaggerSpecOptions = {
      controllers: [],
    };

    expect(options.controllers).toEqual([]);
    expect(options.schemas).toBeUndefined();
  });
});
