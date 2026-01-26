export interface IApiParams {
  url?: string;
  data?: unknown; 
  auth?: Record<string, unknown>;
  params?: unknown; 
  timeout?: number;
  fullEndpoint?: string;
  tryRefetch?: boolean;
  signal?: AbortSignal;
  method?: string;
}

export interface IResponse<T> {
  message: string;
  error: boolean;
  err: unknown;
  data: T;
  statusCode?: number;
}
