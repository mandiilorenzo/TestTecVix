import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import { STATUS_CODE } from "../constants/statusCode";

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token not provided", STATUS_CODE.UNAUTHORIZED);
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    throw new AppError("Token error", STATUS_CODE.UNAUTHORIZED);
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    throw new AppError("Token malformatted", STATUS_CODE.UNAUTHORIZED);
  }

  if (!token || token === "undefined" || token === "null") {
    throw new AppError("Token invalid", STATUS_CODE.UNAUTHORIZED);
  }

  try {
    const userPayload = verifyToken(token);

    req.user = userPayload;

    return next();
  } catch (error) {
    console.error("[Auth Middleware Error]:", error);
    throw new AppError("Invalid or expired token", STATUS_CODE.UNAUTHORIZED);
  }
};
