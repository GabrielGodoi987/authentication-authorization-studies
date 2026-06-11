jest.mock("../../src/webserver/server", () => ({
  main: jest.fn().mockResolvedValue(undefined),
}));

import request from "supertest";
import { app } from "../../src/app";

describe("Express App", () => {
  beforeAll(() => {
    process.env.API_TOKEN = "test-api-token";
  });

  it("responds with welcome message at GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Welcome to the Auth JWT API" });
  });

  it("returns 401 at GET /users when no API token is provided", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "API token not provided" });
  });

  it("returns 401 at GET /carts when no API token is provided", async () => {
    const res = await request(app).get("/carts");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "API token not provided" });
  });

  it("returns 403 at GET /users with an invalid API token", async () => {
    const res = await request(app)
      .get("/users")
      .set("x-api-token", "wrong-token");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Invalid API token" });
  });

  it("serves Swagger UI at GET /api-docs/", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger");
  });

  it("serves Swagger UI at GET /api-docs (without trailing slash)", async () => {
    const res = await request(app).get("/api-docs");
    expect([200, 301, 302]).toContain(res.status);
  });
});
