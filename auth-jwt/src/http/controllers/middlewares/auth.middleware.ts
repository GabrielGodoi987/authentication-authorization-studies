import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { processEnv } from "../../../lib/consts";
import {
  ExpiredTokenException,
  MissingTokenException,
} from "../../exceptions/auth.exception";

export class AuthMiddleware {
  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    const protectedRoutes: string[] = ["/users"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      req.url.startsWith(route),
    );

    if (!isProtectedRoute) {
      return next();
    }

    const authHeader = req.headers["authorization"] || req.cookies?.accessToken;

    if (!authHeader) {
      next(
        new MissingTokenException({
          message: "Token wasn't provided",
        }),
      );
      return;
    }

    const token = authHeader.split(" ")[1] ?? authHeader;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const payload = jwt.verify(token, processEnv.JWT_PUBLIC_KEY, {
        algorithms: ["RS256"],
      }) as {
        sub: string;
        userName: string;
        userEmail: string;
        iat: number;
        exp: number;
      };

      (req as any).user = {
        id: payload.sub,
        name: payload.userName,
        email: payload.userEmail,
      };

      next();
    } catch (err: any) {
      if (err instanceof TokenExpiredError) {
        return next(
          new ExpiredTokenException({
            message: "Token has expired",
            options: {
              cause: err,
            },
          }),
        );
      }
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}
