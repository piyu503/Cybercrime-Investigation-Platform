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
  message?: string;
  case_id?: string;
  // Legacy fields kept for backward compat
  processed_files?: number;
  failed_files?: number;
  results?: ProcessResult[];
}

/**
 * Trigger background evidence processing for a case.
 * The server returns 200 immediately; processing continues in the background.
 * Use a long timeout (10 min) in case someone uses the synchronous path.
 */
export async function processEvidence(caseId: string): Promise<ProcessResponse> {
  if (!caseId) throw new Error("caseId is required.");
  const response = await axiosInstance.post<ProcessResponse>(
    API_ENDPOINTS.process.processEvidence(caseId),
    null,
    { timeout: 600000 } // 10 minutes — covers both async and any slow sync path
  );
  return response.data;
}
