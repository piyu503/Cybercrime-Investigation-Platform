export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type RequestStatus = "idle" | "loading" | "success" | "error";
