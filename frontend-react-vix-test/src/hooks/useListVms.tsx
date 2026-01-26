import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { api, ApiError } from "../services/api";
import { toast } from "react-toastify";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useZUserProfile } from "../stores/useZUserProfile";
import { IVMCreatedResponse } from "../types/VMTypes";
import { IListAll, IParams } from "../types/ListAllTypes";

const DEFAULT_LIMIT = 20;

export const useListVms = (initialParams: IParams = {}) => {
  const [vmList, setVmList] = useState<IVMCreatedResponse[]>([]);
  const [vmTotalCount, setVmTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [onlyMyVms, setOnlyMyVms] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const filtersRef = useRef<IParams>({ limit: DEFAULT_LIMIT, page: 1, ...initialParams });

  const { setTotalCountVMs } = useZGlobalVar();

  const { idBrand, role } = useZUserProfile();

  const fetchListVms = useCallback(async (params: IParams = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const finalParams = { ...filtersRef.current, ...params };
    filtersRef.current = finalParams;

    if (params.page) setCurrentPage(params.page);

    setIsLoading(true);
    setError(null);

    try {
      let targetBrand = params.idBrandMaster !== undefined ? params.idBrandMaster : idBrand;

      if (onlyMyVms && idBrand) {
        targetBrand = idBrand;
      }

      const queryParams: Record<string, string | number | boolean | null | undefined> = {
        limit: finalParams.limit,
        page: finalParams.page,
        search: finalParams.search || search,
        status: finalParams.status || statusFilter,
        idBrandMaster: targetBrand,
      };

      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === undefined || queryParams[key] === "" || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const response = await api.get<IListAll<IVMCreatedResponse>>({
        url: "/vm",
        params: queryParams,
        signal: controller.signal,
      });

      if (response.error) {
        throw new ApiError(response.message, response.statusCode);
      }

      const data = response.data;
      const results = data.result || [];
      const total = data.totalCount || 0;

      setVmList(results);
      setVmTotalCount(total);

      const limit = finalParams.limit || DEFAULT_LIMIT;
      setTotalPages(limit > 0 ? Math.ceil(total / limit) : 0);

      if (setTotalCountVMs) setTotalCountVMs(total);

    } catch (error: unknown) {
      if (axios.isCancel(error) || (error instanceof Error && error.name === "AbortError")) return;

      let msg = "Erro ao buscar VMs.";
      if (error instanceof ApiError) msg = error.message;
      else if (error instanceof Error) msg = error.message;

      setError(msg);
      if (!msg.includes("canceled")) {
        setVmList([]);
        setVmTotalCount(0);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, [idBrand, search, statusFilter, onlyMyVms, setTotalCountVMs]);

  const onToggleStatusVM = async (vm: IVMCreatedResponse) => {
    try {
      setIsLoading(true);
      const action = vm.status === "RUNNING" ? "stop" : "start";
      const response = await api.post({ url: `/vm/${vm.idVM}/${action}` });

      if (response.error) throw new Error(response.message);

      toast.success(`VM ${action === "start" ? "iniciada" : "parada"} com sucesso!`);
      fetchListVms({ page: currentPage }); 
    } catch (error) {
      toast.error(error.message || "Erro ao alterar status da VM");
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteVM = async (idVM: number) => {
    try {
      if (role !== "admin") {
        toast.error("Apenas administradores podem deletar VMs.");
        return;
      }

      setIsLoading(true);
      const response = await api.delete({ url: `/vm/${idVM}` });

      if (response.error) throw new Error(response.message);

      toast.success("VM deletada com sucesso!");
      const newPage = vmList.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      fetchListVms({ page: newPage });

    } catch (error){
      toast.error(error.message || "Erro ao deletar VM");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshList = useCallback(() => { fetchListVms(); }, [fetchListVms]);
  const changePage = useCallback((newPage: number) => { fetchListVms({ page: newPage }); }, [fetchListVms]);

  useEffect(() => {
    if (idBrand) {
      fetchListVms();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchListVms, idBrand]); 

  return {
    vmList,
    vmTotalCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    refreshList,
    changePage,
    fetchListVms,
    search, setSearch,
    statusFilter, setStatusFilter,
    onlyMyVms, setOnlyMyVms,
    onToggleStatusVM,
    onDeleteVM
  };
};