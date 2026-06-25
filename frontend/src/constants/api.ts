export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  cases: {
    getAll: "/cases",
    getById: (caseId: string) => `/cases/${caseId}`,
    create: "/cases/",
  },
  upload: {
    uploadFile: (caseId: string) => `/upload/${caseId}`,
  },
  process: {
    processEvidence: (caseId: string) => `/process/${caseId}`,
  },
  report: {
    download: (caseId: string) => `/report/${caseId}`,
  },
  audit: {
    getLogs: (caseId: string) => `/audit/${caseId}`,
  },
  search: {
    globalSearch: (caseId: string, q: string) => `/search/${caseId}?q=${encodeURIComponent(q)}`,
  },
  dashboard: {
    getMetrics: (caseId: string) => `/dashboard/${caseId}`,
  },
  demo: {
    createDemoCase: "/demo/",
  }
} as const;

export const QUERY_KEYS = {
  cases: {
    all: ["cases"] as const,
    lists: () => [...QUERY_KEYS.cases.all, "list"] as const,
    detail: (caseId: string) => [...QUERY_KEYS.cases.all, "detail", caseId] as const,
  },
  upload: {
    all: ["upload"] as const,
  },
  audit: {
    logs: (caseId: string) => ["audit", caseId] as const,
  },
  search: {
    query: (caseId: string, q: string) => ["search", caseId, q] as const,
  },
  dashboard: {
    metrics: (caseId: string) => ["dashboard", caseId] as const,
  }
} as const;

export const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 2,       // 2 minutes
  gcTime: 1000 * 60 * 10,         // 10 minutes
  retry: 2,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 10000),
} as const;

export const UPLOAD_CONFIG = {
  maxFileSizeBytes: 50 * 1024 * 1024,   // 50 MB
  allowedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;
