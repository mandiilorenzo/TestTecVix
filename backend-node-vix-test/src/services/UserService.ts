import { prisma } from "../database/client";
import { AppError } from "../errors/AppError";
import { STATUS_CODE } from "../constants/statusCode";
import { TUserUpdated } from "../types/validations/User/updateUser";
import { hash } from "bcryptjs";
import { TUserCreated } from "../types/validations/User/createUser";

class UserService {
  async findAll() {
    const users = await prisma.user.findMany({
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        brandMaster: { select: { brandName: true } },
      },
    });
    return users;
  }

  async findById(idUser: string) {
    const user = await prisma.user.findUnique({
      where: { idUser },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        idBrandMaster: true,
      },
    });

    if (!user) throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    return user;
  }

  async create(data: TUserCreated) {
    const emailAlreadyExists = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (emailAlreadyExists) {
      throw new AppError("Email already in use", STATUS_CODE.CONFLICT);
    }

    const passwordHash = await hash(data.password, 8);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  }

  async update(idUser: string, data: TUserUpdated) {
    const userExists = await prisma.user.findUnique({ where: { idUser } });

    if (!userExists) {
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    if (data.email && data.email !== userExists.email) {
      const emailAlreadyExists = await prisma.user.findFirst({
        where: { email: data.email },
      });
      if (emailAlreadyExists) {
        throw new AppError("Email already in use", STATUS_CODE.CONFLICT);
      }
    }

    const userUpdated = await prisma.user.update({
      where: { idUser },
      data: { ...data },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return userUpdated;
  }

  async delete(idUser: string) {
    const userExists = await prisma.user.findUnique({ where: { idUser } });
    if (!userExists)
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);

    await prisma.user.delete({ where: { idUser } });
    return { message: "User deleted successfully" };
  }
}

export const userService = new UserService();
