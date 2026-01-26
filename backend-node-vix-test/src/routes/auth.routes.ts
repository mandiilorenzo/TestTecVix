import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { validateResource } from "../middlewares/validateResource";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { API_VERSION } from "../constants/basePathRoutes";

export const authRoutes = Router();

const AUTH_PATH = `${API_VERSION.MAIN}/auth`;

authRoutes.post(
  `${AUTH_PATH}/register`,
  validateResource(registerSchema),
  AuthController.register,
);

authRoutes.post(
  `${AUTH_PATH}/login`,
  validateResource(loginSchema),
  AuthController.login,
);
