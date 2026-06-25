import { useQuery } from "@tanstack/react-query";
import { getAllCases } from "../api/cases.api";
import { QUERY_KEYS, QUERY_CONFIG } from "../constants/api";
import { Case } from "../types/case.types";
import { ApiError } from "../types/api.types";

export function useCases() {
  return useQuery<Case[], ApiError>({
    queryKey: QUERY_KEYS.cases.lists(),
    queryFn: getAllCases,
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
    retry: QUERY_CONFIG.retry,
    retryDelay: QUERY_CONFIG.retryDelay,
  });
}
