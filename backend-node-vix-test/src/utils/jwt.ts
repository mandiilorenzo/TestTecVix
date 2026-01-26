import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { IPayload } from "../types/auth";

const secret = process.env.JWT_SECRET as string;

const jwtConfig: SignOptions = {
  expiresIn: "1d",
  algorithm: "HS256",
};

export const genToken = (payload: IPayload): string => {
  if (!secret) {
    throw new AppError("JWT_SECRET not defined in environment variables", 500);
  }
  return jwt.sign(payload, secret, jwtConfig);
};

export const verifyToken = (token: string): IPayload => {
  if (!secret) {
    throw new AppError("JWT_SECRET not defined in environment variables", 500);
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded as IPayload;
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
};
