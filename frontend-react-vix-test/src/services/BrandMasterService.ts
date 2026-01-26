import { api } from "./api";
import { IBrandMasterResponse } from "../types/BrandMasterTypes";

export type CreateBrandMasterInput = Omit<
  Partial<IBrandMasterResponse>,
  "emailContact"
> & {
  emailContact?: string | null;
  cnpj?: string | null;
  cep?: string | null;
  cityCode?: number | null;
  district?: string | null;
  isActive?: boolean;
  isPoc?: boolean;
  location?: string | null;
  domain?: string | null;
  brandLogo?: string | null;
};

export const BrandMasterService = {
  create: async (data: CreateBrandMasterInput) => {
    return await api.post<IBrandMasterResponse>({
      url: "/brand-master",
      data: data,
    });
  },

  update: async (id: number, data: CreateBrandMasterInput) => {
    return await api.put<IBrandMasterResponse>({
      url: `/brand-master/${id}`,
      data: data,
    });
  },

  updateWhiteLabel: async (id: number, data: CreateBrandMasterInput) => {
    return await api.put<IBrandMasterResponse>({
      url: `/brand-master/${id}`,
      data: data,
    });
  },
};
