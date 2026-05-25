import { NextFunction, Request, Response } from "express";

export class ApiTokenMiddleware {
  public async verifyApiToken(req: Request, res: Response, next: NextFunction) {
    const apiToken = req.headers["x-api-token"];

    console.log(apiToken);

    if (!apiToken) {
      return res.status(401).json({ message: "API token not provided" });
    }

    if (apiToken !== process.env.API_TOKEN) {
      return res.status(403).json({ message: "Invalid API token" });
    }

    next();
  }
}
