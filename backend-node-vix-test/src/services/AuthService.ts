import { prisma } from "../database/client";
import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError";
import { LoginDTO, RegisterDTO, AuthResponse } from "../types/auth";
import { genToken } from "../utils/jwt";
import { STATUS_CODE } from "../constants/statusCode";
import { ERROR_MESSAGE } from "../constants/erroMessages";

class AuthService {
  async login({ email, password }: LoginDTO): Promise<AuthResponse> {
    const userFound = await prisma.user.findFirst({
      where: { email },
    });

    if (!userFound) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);

    if (!passwordMatch) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const token = genToken({
      id: userFound.idUser,
      role: userFound.role,
      idBrandMaster: userFound.idBrandMaster,
    });

    return {
      user: {
        idUser: userFound.idUser,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
        isActive: userFound.isActive ?? false,
        idBrand: userFound.idBrandMaster,
      },
      token,
    };
  }

  async register(data: RegisterDTO) {
    const userExists = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (userExists) {
      throw new AppError(
        ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: passwordHash,
        idBrandMaster: data.idBrandMaster || null,
        role: "member",
      },
    });

    return {
      idUser: newUser.idUser,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      idBrandMaster: newUser.idBrandMaster,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    };
  }
}

export default new AuthService();
