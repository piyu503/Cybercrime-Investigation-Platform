import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processEvidence, ProcessResponse } from "../api/process.api";
import { QUERY_KEYS } from "../constants/api";
import { ApiError } from "../types/api.types";

/**
 * Process evidence for a case and invalidate the case detail cache.
 */
export function useProcessEvidence(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation<ProcessResponse, ApiError, void>({
    mutationFn: () => processEvidence(caseId),
    onSuccess: () => {
      // Refetch the specific case to get the newly processed files
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cases.detail(caseId) });
    },
  });
}
