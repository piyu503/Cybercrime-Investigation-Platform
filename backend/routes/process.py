from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from database.mongodb import get_database
from orchestrator.pipeline import start_pipeline
from pydantic import BaseModel

router = APIRouter()

from typing import List, Dict, Any

class ProcessResponse(BaseModel):
    status: str
    processed_files: int
    failed_files: int
    results: List[Dict[str, Any]]

@router.post(
    "/{case_id}",
    response_model=ProcessResponse,
    status_code=status.HTTP_200_OK,
    summary="Process all unprocessed evidence for a case",
)
async def process_evidence(case_id: str):
    db = get_database()

    if not ObjectId.is_valid(case_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{case_id}' is not a valid case ID.",
        )

    existing_case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not existing_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with ID '{case_id}' was not found.",
        )

    # Run the pipeline
    result = await start_pipeline(case_id)

    return ProcessResponse(
        status=result.get("status", "completed"),
        processed_files=result.get("processed_files", 0),
        failed_files=result.get("failed_files", 0),
        results=result.get("results", [])
    )
