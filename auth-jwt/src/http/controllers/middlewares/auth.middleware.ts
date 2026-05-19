import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  private readonly protectedRoutes: string[] = ["/users"];

  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    const isProtectedRoute = this.protectedRoutes.some((route) =>
      req.url.startsWith(route),
    );

    if (!isProtectedRoute) {
      return next();
    }

    const authHeader = req.headers["Authorization"]?.replace("Bearer ", "");

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header not provided" });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const payload = jwt.verify(token, "jesus_is_king");
      console.log(payload);

      next();
    } catch (err: any) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}
