import { useState } from "react";
import { api } from "../services/api";
import { IListAll } from "../types/ListAllTypes";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { IVMCreatedResponse, ICreateVMPayload } from "../types/VMTypes";

export const useMyVMList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();

  const fetchMyVmsList = async (
    params: {
      status?: string;
      page?: number;
      limit?: number;
      search?: string;
      orderBy?: string;
      idBrandMaster?: number | "null" | null;
    } = {},
  ) => {
    const auth = await getAuth();
    setIsLoading(true);

    const cleanParams = { ...params };
    if (!cleanParams.status) delete cleanParams.status;
    if (!cleanParams.search) delete cleanParams.search;
    if (cleanParams.idBrandMaster === undefined) delete cleanParams.idBrandMaster;

    const response = await api.get<IListAll<IVMCreatedResponse>>({
      url: "/vm",
      auth,
      params: cleanParams,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return { totalCount: 0, vmList: [] };
    }

    const vmList = response.data?.result;
    const totalCount = parseInt(response.data?.totalCount?.toString() || "0");
    return { totalCount, vmList };
  };

  const toggleStatusVM = async (idVM: number, currentStatus: string) => {
    const auth = await getAuth();
    setIsLoading(true);
    const action = currentStatus === "RUNNING" ? "stop" : "start";

    const response = await api.post({
      url: `/vm/${idVM}/${action}`,
      auth,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message || `Erro ao executar ${action}`);
      return false;
    }

    toast.success(`VM ${action === "start" ? "iniciada" : "parada"} com sucesso!`);
    return true;
  };

  const deleteVM = async (idVM: number) => {
    const auth = await getAuth();
    setIsLoading(true);

    const response = await api.delete({
      url: `/vm/${idVM}`,
      auth,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message || "Erro ao deletar VM");
      return false;
    }

    toast.success("VM deletada com sucesso!");
    return true;
  };

  const updateVM = async (idVM: number, data: Partial<ICreateVMPayload>) => {
    const auth = await getAuth();
    setIsLoading(true);

    const response = await api.put({
      url: `/vm/${idVM}`,
      auth,
      data,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message || "Erro ao atualizar VM");
      return false;
    }

    toast.success("VM atualizada com sucesso!");
    return true;
  };

  return {
    isLoading,
    fetchMyVmsList,
    toggleStatusVM,
    deleteVM,
    updateVM
  };
};