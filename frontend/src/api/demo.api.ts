import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";

export async function createDemoCase(): Promise<{ message: string; case_id: string }> {
  const response = await axiosInstance.post<{ message: string; case_id: string }>(
    API_ENDPOINTS.demo.createDemoCase
  );
  return response.data;
}
