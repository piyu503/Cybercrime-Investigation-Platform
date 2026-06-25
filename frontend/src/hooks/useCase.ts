import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCaseById, createCase } from "../api/cases.api";
import { QUERY_KEYS, QUERY_CONFIG } from "../constants/api";
import { Case, CreateCaseResponse, CreateCasePayload } from "../types/case.types";
import { ApiError } from "../types/api.types";

/**
 * Fetch a single case by ID.
 * Skips the query when caseId is empty/undefined.
 */
export function useCase(caseId: string) {
  return useQuery<Case, ApiError>({
    queryKey: QUERY_KEYS.cases.detail(caseId),
    queryFn: () => getCaseById(caseId),
    enabled: Boolean(caseId),
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
    retryDelay: QUERY_CONFIG.retryDelay,
  });
}

/**
 * Create a new case and invalidate the cases list cache on success.
 */
export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation<CreateCaseResponse, ApiError, CreateCasePayload>({
    mutationFn: createCase,
    onSuccess: () => {
      // Invalidate the list so it refetches with the new case
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cases.lists() });
    },
  });
}
