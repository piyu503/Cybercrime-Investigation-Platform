import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";
import { UploadResponse } from "../types/case.types";
import { UploadProgress } from "../types/api.types";

/**
 * Upload a single file to a case.
 */
export async function uploadFile(
  caseId: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  if (!caseId) throw new Error("caseId is required.");

  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<UploadResponse>(
    API_ENDPOINTS.upload.uploadFile(caseId),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (event) => {
            const total = event.total ?? 0;
            const loaded = event.loaded ?? 0;
            const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
            onProgress({ loaded, total, percentage });
          }
        : undefined,
    }
  );

  return response.data;
}

/**
 * Upload multiple files to a case sequentially, reporting per-file and
 * aggregate progress via callbacks.
 */
export async function uploadMultipleFiles(
  caseId: string,
  files: File[],
  options?: {
    onFileProgress?: (fileIndex: number, progress: UploadProgress) => void;
    onOverallProgress?: (completed: number, total: number) => void;
  }
): Promise<UploadResponse[]> {
  if (!caseId) throw new Error("caseId is required.");
  if (!files.length) return [];

  const results: UploadResponse[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadFile(caseId, files[i], (progress) => {
      options?.onFileProgress?.(i, progress);
    });

    results.push(result);
    options?.onOverallProgress?.(i + 1, files.length);
  }

  return results;
}
