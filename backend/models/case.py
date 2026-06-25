from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ─── File Metadata ────────────────────────────────────────────────────────────

class FileMetadata(BaseModel):
    filename: str
    filepath: str
    filetype: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    is_processed: bool = False
    processed_data: Optional[dict] = None


# ─── Case Request / Response Models ───────────────────────────────────────────

class CreateCaseRequest(BaseModel):
    case_name: str = Field(..., min_length=1, max_length=255, description="Name of the case")
    description: str = Field(..., min_length=1, description="Detailed description of the case")

    model_config = {
        "json_schema_extra": {
            "example": {
                "case_name": "Murder Investigation",
                "description": "Case details regarding the incident on 20-Jun-2026.",
            }
        }
    }


class CreateCaseResponse(BaseModel):
    case_id: str


class CaseOut(BaseModel):
    id: str = Field(alias="_id")
    case_name: str
    description: str
    created_at: datetime
    files: List[FileMetadata] = []

    model_config = {"populate_by_name": True}


# ─── Upload Response ───────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    message: str
    case_id: str
    file: FileMetadata
