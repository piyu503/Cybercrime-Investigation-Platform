import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { uploadFile, uploadMultipleFiles } from "../api/upload.api";
import { QUERY_KEYS } from "../constants/api";
import { UploadResponse } from "../types/case.types";
import { ApiError, UploadProgress } from "../types/api.types";

// ─── Single file upload ──────────────────────────────────────────────────────

interface UseUploadOptions {
  onSuccess?: (data: UploadResponse) => void;
  onError?: (error: ApiError) => void;
}

export function useUpload(caseId: string, options?: UseUploadOptions) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const mutation = useMutation<UploadResponse, ApiError, File>({
    mutationFn: (file: File) =>
      uploadFile(caseId, file, (p) => setProgress(p)),
    onSuccess: (data) => {
      setProgress({ loaded: 0, total: 0, percentage: 0 });
      // Invalidate the case detail so file list refreshes
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.cases.detail(caseId),
      });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return { ...mutation, progress };
}

// ─── Multi-file upload ───────────────────────────────────────────────────────

interface UseMultiUploadOptions {
  onSuccess?: (data: UploadResponse[]) => void;
  onError?: (error: ApiError) => void;
}

export function useMultiUpload(caseId: string, options?: UseMultiUploadOptions) {
  const queryClient = useQueryClient();

  const [fileProgress, setFileProgress] = useState<Record<number, UploadProgress>>({});
  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 0 });

  const mutation = useMutation<UploadResponse[], ApiError, File[]>({
    mutationFn: (files: File[]) =>
      uploadMultipleFiles(caseId, files, {
        onFileProgress: (index, progress) =>
          setFileProgress((prev) => ({ ...prev, [index]: progress })),
        onOverallProgress: (completed, total) =>
          setOverallProgress({ completed, total }),
      }),
    onSuccess: (data) => {
      setFileProgress({});
      setOverallProgress({ completed: 0, total: 0 });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.cases.detail(caseId),
      });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });

  return { ...mutation, fileProgress, overallProgress };
}
