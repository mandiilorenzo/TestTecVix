import { create } from "zustand";
import { middlewareLocalStorage } from "./middlewareLocalStorage";

export type TRole = "admin" | "manager" | "member";

export interface IUserProfile {
  idUser: string | null;
  profileImgUrl: string | null;
  objectName?: string;
  imageUrl?: string;
  username: string | null;
  isActive?: boolean;
  lastLoginDate?: string | Date;
  userEmail: string | null;
  token: string | null;
  idBrand: number | null;
  role: TRole | null;
}
const INIT_STATE: IUserProfile = {
  idUser: null,
  profileImgUrl: null,
  objectName: "",
  imageUrl: "",
  username: null,
  userEmail: null,
  token: null,
  idBrand: null,
  lastLoginDate: "",
  role: null,
};

interface IUserProfileState extends IUserProfile {
  setUser: (user: Partial<IUserProfile>) => void;
  setImage: ({
    imageUrl,
    objectName,
  }: {
    imageUrl: string;
    objectName: string;
  }) => void;
  resetAll: () => void;
}
const middle = middlewareLocalStorage<IUserProfileState>("@vituax-test:user-profile-v1");

export const useZUserProfile = create<IUserProfileState>()(
  middle((set) => ({
    ...INIT_STATE,
    setUser: (user) => set((state) => ({ ...state, ...user })),
    setImage: ({ imageUrl, objectName }) =>
      set((state) => ({ ...state, imageUrl, objectName })),
    resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
  })),
);
