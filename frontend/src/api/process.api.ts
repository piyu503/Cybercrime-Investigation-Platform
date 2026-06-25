import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";

export interface ProcessResult {
  filename: string;
  classification?: string;
  status: string;
  error?: string;
}

export interface ProcessResponse {
  status: string;
  processed_files: number;
  failed_files: number;
  results: ProcessResult[];
}

/**
 * Process evidence for a case.
 */
export async function processEvidence(caseId: string): Promise<ProcessResponse> {
  if (!caseId) throw new Error("caseId is required.");
  const response = await axiosInstance.post<ProcessResponse>(
    API_ENDPOINTS.process.processEvidence(caseId)
  );
  return response.data;
}
