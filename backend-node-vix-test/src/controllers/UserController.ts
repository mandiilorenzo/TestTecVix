import { Request, Response } from "express";
import { userService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";
import { userUpdatedSchema } from "../types/validations/User/updateUser";
import { userCreatedSchema } from "../types/validations/User/createUser";

class UserController {
  async list(req: Request, res: Response) {
    const result = await userService.findAll();
    return res.status(STATUS_CODE.OK).json(result);
  }

  async listById(req: Request, res: Response) {
    const id = req.params.id as string;

    const result = await userService.findById(id);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async create(req: Request, res: Response) {
    const data = userCreatedSchema.parse(req.body);

    const result = await userService.create(data);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;

    const data = userUpdatedSchema.parse(req.body);

    const result = await userService.update(id, data);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await userService.delete(id);
    return res.status(STATUS_CODE.NO_CONTENT).send();
  }
}

export { UserController };
