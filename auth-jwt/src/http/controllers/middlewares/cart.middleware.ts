import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { processEnv } from "../../../lib/consts";
import {
  ExpiredTokenException,
  MissingTokenException,
} from "../../exceptions/auth.exception";

export interface JwtPayload {
  sub: string;
  userName: string;
  userEmail: string;
}

export class CartMiddleware {
  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    const verifiedRoutes: string[] = ["/cart"];

    const isVerifiedRoute = verifiedRoutes.some((route) =>
      req.url.startsWith(route),
    );

    if (!isVerifiedRoute) {
      return next();
    }

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      next(
        new MissingTokenException({
          message: "Token wasn't provided",
        }),
      );
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const payload = jwt.verify(token, processEnv.JWT_PUBLIC_KEY, {
        algorithms: ["RS256"],
      }) as JwtPayload & { iat: number; exp: number };

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
            options: { cause: err },
          }),
        );
      }
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}
