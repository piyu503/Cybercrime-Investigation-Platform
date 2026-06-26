import axiosInstance from "./axios";

export interface CopilotResponse {
  answer: string;
}

export async function askCopilot(caseId: string, question: string): Promise<CopilotResponse> {
  // Gemma 4 local inference can take up to 3 minutes — use a dedicated long timeout
  const response = await axiosInstance.post<CopilotResponse>(
    `/copilot/${caseId}`,
    { question },
    { timeout: 180000 }  // 3 minutes
  );
  return response.data;
}
