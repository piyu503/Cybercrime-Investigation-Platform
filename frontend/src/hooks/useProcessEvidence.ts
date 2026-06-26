import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processEvidence, ProcessResponse } from "../api/process.api";
import { QUERY_KEYS } from "../constants/api";
import { ApiError } from "../types/api.types";
import axiosInstance from "../api/axios";

const POLL_INTERVAL = 5000;   // poll every 5s
const POLL_TIMEOUT  = 600000; // stop polling after 10 min

/**
 * Trigger background evidence processing and poll the case until
 * processing_status changes from "processing" to "completed" or "failed".
 */
export function useProcessEvidence(caseId: string) {
  const queryClient = useQueryClient();
  const pollingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingStart = useRef<number>(0);

  function stopPolling() {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current);
      pollingTimer.current = null;
    }
  }

  function startPolling(onDone: () => void, onFail: () => void) {
    stopPolling();
    pollingStart.current = Date.now();

    pollingTimer.current = setInterval(async () => {
      try {
        // Fetch the current case to check processing_status
        const resp = await axiosInstance.get(`/cases/${caseId}`);
        const status: string = resp.data?.processing_status ?? "";

        if (status === "completed") {
          stopPolling();
          // Invalidate all dependent queries so the UI refreshes with live data
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cases.detail(caseId) });
          queryClient.invalidateQueries({ queryKey: ["timeline", caseId] });
          queryClient.invalidateQueries({ queryKey: ["knowledge-graph", caseId] });
          queryClient.invalidateQueries({ queryKey: ["intelligence", caseId] });
          queryClient.invalidateQueries({ queryKey: ["readiness", caseId] });
          queryClient.invalidateQueries({ queryKey: ["summary", caseId] });
          onDone();
        } else if (status === "failed") {
          stopPolling();
          onFail();
        } else if (Date.now() - pollingStart.current > POLL_TIMEOUT) {
          stopPolling();
          onFail();
        }
      } catch {
        // silently retry on network errors
      }
    }, POLL_INTERVAL);
  }

  // Clean up polling on unmount
  useEffect(() => () => stopPolling(), []);

  return {
    ...useMutation<ProcessResponse, ApiError, void>({
      mutationFn: () => processEvidence(caseId),
    }),
    startPolling,
    stopPolling,
  };
}
