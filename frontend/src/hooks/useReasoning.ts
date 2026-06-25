import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getKnowledgeGraph, 
  createTimeline, 
  fetchTimeline, 
  generateIntelligence,
  getIntelligence,
  getReadinessScore,
  generateSummary,
  KnowledgeGraph,
  TimelineEvent,
  IntelligenceReport,
  IntelligenceSummary,
  ReadinessScore
} from "../api/reasoning.api";

export function useKnowledgeGraphQuery(caseId: string | undefined) {
  return useQuery<KnowledgeGraph>({
    queryKey: ["knowledge-graph", caseId],
    queryFn: () => getKnowledgeGraph(caseId!),
    enabled: !!caseId,
  });
}

export function useTimeline(caseId: string | undefined) {
  return useQuery<TimelineEvent[]>({
    queryKey: ["timeline", caseId],
    queryFn: () => fetchTimeline(caseId!),
    enabled: !!caseId,
  });
}

export function useGenerateTimeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: string) => createTimeline(caseId),
    onSuccess: (_, caseId) => {
      queryClient.invalidateQueries({ queryKey: ["timeline", caseId] });
    },
  });
}

export function useIntelligence(caseId: string | undefined) {
  return useQuery<IntelligenceReport>({
    queryKey: ["intelligence", caseId],
    queryFn: () => getIntelligence(caseId!),
    enabled: !!caseId,
  });
}

export function useGenerateIntelligence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: string) => generateIntelligence(caseId),
    onSuccess: (data, caseId) => {
      queryClient.setQueryData(["intelligence", caseId], data);
      queryClient.invalidateQueries({ queryKey: ["readiness", caseId] });
      queryClient.invalidateQueries({ queryKey: ["summary", caseId] });
    },
  });
}

export function useReadiness(caseId: string | undefined) {
  return useQuery<ReadinessScore>({
    queryKey: ["readiness", caseId],
    queryFn: () => getReadinessScore(caseId!),
    enabled: !!caseId,
  });
}

export function useSummary(caseId: string | undefined) {
  return useQuery<IntelligenceSummary>({
    queryKey: ["summary", caseId],
    queryFn: () => generateSummary(caseId!),
    enabled: !!caseId,
  });
}
