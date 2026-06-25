import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";
import { Case, CreateCaseResponse, CreateCasePayload } from "../types/case.types";

/**
 * Fetch all cases.
 */
export async function getAllCases(): Promise<Case[]> {
  const response = await axiosInstance.get<Case[]>(API_ENDPOINTS.cases.getAll);
  return response.data;
}

/**
 * Fetch a single case by its ID.
 */
export async function getCaseById(caseId: string): Promise<Case> {
  if (!caseId) throw new Error("caseId is required.");
  const response = await axiosInstance.get<Case>(
    API_ENDPOINTS.cases.getById(caseId)
  );
  return response.data;
}

/**
 * Create a new case.
 */
export async function createCase(payload: CreateCasePayload): Promise<CreateCaseResponse> {
  const response = await axiosInstance.post<CreateCaseResponse>(
    API_ENDPOINTS.cases.create,
    payload
  );
  return response.data;
}

export async function uploadEvidence(caseId: string, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(`/upload/${caseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

