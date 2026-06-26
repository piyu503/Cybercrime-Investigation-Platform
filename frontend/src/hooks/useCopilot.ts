import { useMutation } from "@tanstack/react-query";
import { askCopilot, CopilotResponse } from "../api/copilot.api";

export function useCopilotQuery(caseId: string) {
  return useMutation<CopilotResponse, Error, string>({
    mutationFn: (question: string) => askCopilot(caseId, question),
  });
}
