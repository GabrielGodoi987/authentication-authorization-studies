import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MissingTokenException } from "../../exceptions/auth.exception";

export class AuthMiddleware {
  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    const protectedRoutes: string[] = ["/users"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      req.url.startsWith(route),
    );

    if (!isProtectedRoute) {
      return next();
    }

    const authHeader = req.headers["authorization"]?.replace("Bearer ", "");

    if (!authHeader) {
      next(
        new MissingTokenException({
          message: "Token wasn't provided",
        }),
      );
      return;
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
