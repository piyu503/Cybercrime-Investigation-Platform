import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants/api";

export interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  preview: string;
}

export interface SearchResults {
  files: SearchResultItem[];
  entities: SearchResultItem[];
  timeline: SearchResultItem[];
  intelligence: SearchResultItem[];
}

export async function globalSearch(caseId: string, q: string): Promise<SearchResults> {
  const response = await axiosInstance.get<SearchResults>(
    API_ENDPOINTS.search.globalSearch(caseId, q)
  );
  return response.data;
}
