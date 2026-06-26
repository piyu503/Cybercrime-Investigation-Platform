import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";
import { AuditLog } from "./audit.api";

export interface DashboardMetrics {
  total_evidence: number;
  processed_evidence: number;
  total_events: number;
  total_nodes: number;
  total_edges: number;
  entities_count: number;
  recommendations_count: number;
  contradictions_count: number;
  gaps_count: number;
  readiness_score: number;
  investigation_status: string;
  processing_time_seconds: number;
  recent_activity: AuditLog[];
}

export async function getDashboardMetrics(caseId: string): Promise<DashboardMetrics> {
  const response = await axiosInstance.get<DashboardMetrics>(
    API_ENDPOINTS.dashboard.getMetrics(caseId)
  );
  return response.data;
}
