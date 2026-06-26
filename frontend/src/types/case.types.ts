export interface FileMetadata {
  filename: string;
  filepath: string;
  filetype: string;
  uploaded_at: string;
  sha256_hash?: string;
  is_processed?: boolean;
  processed_data?: {
    extracted_text?: string;
    classification?: string;
    metadata?: Record<string, any>;
    entities?: {
      persons?: string[];
      phones?: string[];
      vehicles?: string[];
      locations?: string[];
      dates?: string[];
      times?: string[];
      organizations?: string[];
      emails?: string[];
      money?: string[];
      evidence_ids?: string[];
      confidence?: Record<string, number>;
    };
  };
}

export interface Case {
  _id: string;
  case_name: string;
  description: string;
  created_at: string;
  files: FileMetadata[];
}

export interface CreateCasePayload {
  case_name: string;
  description: string;
}

export interface CreateCaseResponse {
  case_id: string;
}

export interface UploadResponse {
  message: string;
  case_id: string;
  file: FileMetadata;
}
