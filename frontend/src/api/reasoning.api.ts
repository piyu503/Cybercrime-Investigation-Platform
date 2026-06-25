import axiosInstance from "./axios";

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  confidence: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  confidence: number;
  evidence_file: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TimelineEvent {
  timestamp: string;
  event_type: string;
  description: string;
  supporting_evidence: string[];
  related_entities: string[];
  locations: string[];
  confidence: number;
  reliability?: string;
}

export interface Contradiction {
  severity: string;
  confidence: string;
  reason: string;
  supporting_evidence: string[];
  related_entities: string[];
  related_timeline_events: string[];
  suggested_verification: string;
}

export interface InvestigationGap {
  reason: string;
  severity: string;
  priority: string;
  affected_stage: string;
  confidence: string;
  recommended_evidence: string;
  supporting_evidence: string[];
  related_entities: string[];
  related_timeline_events: string[];
}

export interface EvidenceValidation {
  missing_evidence: string[];
  weak_evidence: string[];
  duplicate_evidence: string[];
  unverified_evidence: any[];
  incomplete_sections: string[];
}

export interface IntelligenceRecommendation {
  action: string;
  type: string;
  priority: string;
  reason: string;
  confidence: string;
  supporting_evidence: string[];
  related_entities: string[];
  related_timeline_events: string[];
  expected_outcome: string;
}

export interface IntelligenceSummary {
  case_overview: string;
  investigation_status: string;
  critical_findings: string[];
  major_events: string[];
  major_contradictions: string[];
  investigation_gaps: string[];
  overall_assessment: string;
}

export interface ReadinessScore {
  overall_score: number;
  status: string;
  positive_factors: { reason: string; impact: string }[];
  negative_factors: { reason: string; impact: string }[];
}

export interface IntelligenceReport {
  contradictions: Contradiction[];
  gaps: InvestigationGap[];
  validation: EvidenceValidation;
  readiness: ReadinessScore;
  recommendations: IntelligenceRecommendation[];
  summary?: IntelligenceSummary;
}

// Ensure the endpoints use caseId directly instead of relying on constants if missing
export async function getKnowledgeGraph(caseId: string): Promise<KnowledgeGraph> {
  const response = await axiosInstance.get<KnowledgeGraph>(`/knowledge-graph/${caseId}`);
  return response.data;
}

export async function createTimeline(caseId: string): Promise<{status: string, timeline: TimelineEvent[]}> {
  const response = await axiosInstance.post<{status: string, timeline: TimelineEvent[]}>(`/timeline/${caseId}`);
  return response.data;
}

export async function fetchTimeline(caseId: string): Promise<TimelineEvent[]> {
  const response = await axiosInstance.get<TimelineEvent[]>(`/timeline/${caseId}`);
  return response.data;
}

export async function generateIntelligence(caseId: string): Promise<IntelligenceReport> {
  const response = await axiosInstance.post<IntelligenceReport>(`/intelligence/${caseId}`);
  return response.data;
}

export async function getIntelligence(caseId: string): Promise<IntelligenceReport> {
  const response = await axiosInstance.get<IntelligenceReport>(`/intelligence/${caseId}`);
  return response.data;
}

export async function getReadinessScore(caseId: string): Promise<ReadinessScore> {
  const response = await axiosInstance.get<ReadinessScore>(`/readiness/${caseId}`);
  return response.data;
}

export async function generateSummary(caseId: string): Promise<IntelligenceSummary> {
  const response = await axiosInstance.get<IntelligenceSummary>(`/summary/${caseId}`);
  return response.data;
}
