import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";

export interface AuditLog {
  _id: string;
  case_id: string;
  timestamp: string;
  action: string;
  user: string;
  status: string;
  details: string;
}

export async function getAuditLogs(caseId: string): Promise<AuditLog[]> {
  const response = await axiosInstance.get<AuditLog[]>(
    API_ENDPOINTS.audit.getLogs(caseId)
  );
  return response.data;
}
