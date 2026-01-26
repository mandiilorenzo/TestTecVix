import { api } from "./api";

export interface ICreateUserDTO {
  fullName: string;
  email: string;
  phone?: string;
  username: string;
  password?: string;
  position?: string;
  department?: string;
  hiringDate?: string;
  role: string;
  isActive: boolean;
  idBrandMaster: number;
}

export interface IUpdateUserDTO {
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  profileImgUrl?: string;
}

export const userService = {
  getAll: async () => {
    return await api.get({ url: "/users" });
  },

  create: async (payload: ICreateUserDTO) => {
    return await api.post({ url: "/users", data: payload });
  },

  update: async (id: string, payload: Partial<ICreateUserDTO>) => {
    return await api.put({ url: `/users/${id}`, data: payload });
  },

  remove: async (id: string) => {
    return await api.delete({ url: `/users/${id}` });
  },

  updateMe: async (data: IUpdateUserDTO) => {
    return await api.put({ url: "/users/me", data });
  },

  updatePasswordMe: async (data: {
    currentPassword?: string;
    newPassword?: string;
  }) => {
    return await api.put({ url: "/users/me/change-password", data });
  },

  updateAvatarMe: async (data: { profileImgUrl: string }) => {
    return await api.put({ url: "/users/me/avatar", data });
  },
};
