export interface IUserLoginResponse {
  token: string;
  user: {
    idUser: string;       
    username: string;
    email: string;
    role: "admin" | "manager" | "member";
    isActive: boolean;    
    idBrand: number | null;
    profileImgUrl: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date | null;
  };
}

export interface IRegisterResponse {
  idUser: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
}