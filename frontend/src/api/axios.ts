import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants/api";
import { ApiError } from "../types/api.types";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if present
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.debug(`[API →] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(normalizeError(error));
  }
);

// ─── Response Interceptor ───────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.debug(`[API ←] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    const normalized = normalizeError(error);

    // Handle 401 — clear token and redirect to login if applicable
    if (normalized.status === 401) {
      localStorage.removeItem("auth_token");
      // Dispatch event so the app can handle unauthenticated state
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    if (import.meta.env.DEV) {
      console.error(`[API ✗] ${normalized.status} ${error.config?.url}`, normalized);
    }

    return Promise.reject(normalized);
  }
);

// ─── Error Normalizer ───────────────────────────────────────────────────────

export function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const responseData = error.response.data as Record<string, unknown>;
    return {
      message:
        (responseData?.detail as string) ||
        (responseData?.message as string) ||
        error.message ||
        "An unexpected error occurred.",
      status: error.response.status,
      code: (responseData?.code as string) ?? undefined,
      details: responseData ?? undefined,
    };
  }

  if (error.request) {
    return {
      message: "No response from server. Please check your connection.",
      status: 0,
      code: "NETWORK_ERROR",
    };
  }

  return {
    message: error.message || "Request setup failed.",
    status: -1,
    code: "REQUEST_ERROR",
  };
}

export default axiosInstance;
