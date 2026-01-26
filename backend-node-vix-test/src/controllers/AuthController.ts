import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { STATUS_CODE } from "../constants/statusCode";

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });

    return res.status(STATUS_CODE.OK).json(result);
  }

  async register(req: Request, res: Response) {
    const { username, email, password, idBrandMaster } = req.body;

    const user = await AuthService.register({
      username,
      email,
      password,
      idBrandMaster,
    });

    return res.status(STATUS_CODE.CREATED).json(user);
  }
}

export default new AuthController();
