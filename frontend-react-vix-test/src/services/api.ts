import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useZUserProfile } from "../stores/useZUserProfile";
import { IApiParams, IResponse } from "../types/ApiTypes";

export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export const baseAuth = (auth: Record<string, unknown> = {}) => {
  const signature = import.meta.env.VITE_SIGN_HASH || "";
  const token = useZUserProfile.getState().token;

  const finalAuth = auth.Authorization
    ? auth
    : token
      ? { ...auth, Authorization: `Bearer ${token}` }
      : auth;

  return {
    headers: {
      "x-sign": signature,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      ...finalAuth,
    },
  };
};

const retryRequest = async <T>(config: IApiParams): Promise<IResponse<T>> => {
  const {
    method = "GET",
    url = "",
    data = {},
    auth = {},
    params = {},
    timeout = 50000,
    fullEndpoint = "",
  } = config;

  try {
    const BASE_URL =
      import.meta.env.VITE_BASE_URL || "http://localhost:3001/api/v1";
    const nAuth = baseAuth(auth);

    const axiosConfig: AxiosRequestConfig = {
      ...(timeout && { timeout }),
      method,
      url: fullEndpoint || `${BASE_URL}${url}`,
      data,
      params,
      ...nAuth,
    };

    const response = await axios<T>(axiosConfig);

    return { data: response.data, error: false, err: null, message: "" };
  } catch (error) {
    let message = "Unknown error";
    let statusCode = 500;

    if (error instanceof AxiosError) {
      message = error?.response?.data?.message || error.message;
      statusCode = error?.response?.status || 500;
    }
    // Ajuste aqui também para evitar erro de tipo no catch
    return {
      message,
      error: true,
      err: error,
      data: [] as unknown as T,
      statusCode,
    };
  }
};

const app = async <T>(config: IApiParams): Promise<IResponse<T>> => {
  const {
    method = "GET",
    url = "",
    data = {},
    auth = {},
    params = {},
    timeout = 80000,
    fullEndpoint = "",
    tryRefetch = false,
    signal,
  } = config;

  // 🔒 TRAVA DE SEGURANÇA CORRIGIDA
  const token = useZUserProfile.getState().token;

  // Rotas que não precisam de token
  const isPublicRoute =
    url.includes("session") || url.includes("login") || url.includes("auth");

  if (!token && !isPublicRoute) {
    // ✅ CORREÇÃO: Adicionado 'err' e tipagem segura no 'data'
    return {
      error: true,
      message: "Aguardando autenticação...",
      data: [] as unknown as T, // Resolve o problema do 'any'
      err: null, // Resolve o problema da propriedade faltante
      statusCode: 0,
    };
  }
  // 🔓 FIM DA TRAVA

  try {
    const BASE_URL =
      import.meta.env.VITE_BASE_URL || "http://localhost:3001/api/v1";
    const nAuth = baseAuth(auth);

    const axiosConfig: AxiosRequestConfig = {
      ...(timeout && { timeout }),
      method,
      url: fullEndpoint || `${BASE_URL}${url}`,
      data,
      params,
      signal,
      ...nAuth,
    };

    const response = await axios<T>(axiosConfig);

    return { data: response.data, error: false, err: null, message: "" };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }

    let message = "Unknown error";
    let statusCode = 500;

    if (error instanceof AxiosError) {
      statusCode = error.response?.status || 500;

      if (
        statusCode === 403 ||
        (error.code === "ECONNABORTED" && error.message.includes("timeout"))
      ) {
        if (tryRefetch) {
          return retryRequest<T>({
            method,
            url,
            data,
            auth,
            params,
            timeout: timeout ? timeout * 2 : undefined,
            fullEndpoint,
          });
        }
      }
      message = error?.response?.data?.message || error.message;
    }
    // Ajuste aqui também
    return {
      message,
      error: true,
      err: error,
      data: [] as unknown as T,
      statusCode,
    };
  }
};

const get = async <T>(config: IApiParams = {}) => {
  return app<T>({ ...config, method: "GET" });
};

const remove = async <T>(config: IApiParams = {}) => {
  return app<T>({ ...config, method: "DELETE" });
};

const put = async <T>(config: IApiParams = {}) => {
  return app<T>({ ...config, method: "PUT" });
};

const post = async <T>(config: IApiParams = {}) => {
  return app<T>({ ...config, method: "POST" });
};

export const api = {
  get,
  delete: remove,
  put,
  post,
};
