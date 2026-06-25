from fastapi import APIRouter, UploadFile, File, HTTPException, status
from bson import ObjectId

from database.mongodb import get_database
from models.case import UploadResponse, FileMetadata
from services.file_service import save_file

router = APIRouter()


# ─── POST /upload/{case_id} ───────────────────────────────────────────────────

@router.post(
    "/{case_id}",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload an evidence file to a case",
)
async def upload_evidence(case_id: str, file: UploadFile = File(...)):
    db = get_database()

    # Validate case ID format
    if not ObjectId.is_valid(case_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{case_id}' is not a valid case ID.",
        )

    # Check case exists
    existing_case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not existing_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with ID '{case_id}' was not found.",
        )

    # Read file bytes (needed for size validation + disk write)
    file_bytes = await file.read()

    # Validate + save to disk — raises HTTPException on failure
    file_metadata = save_file(file, file_bytes, case_id)

    # Push file metadata into the case document
    await db["cases"].update_one(
        {"_id": ObjectId(case_id)},
        {"$push": {"files": file_metadata}},
    )

    from services.audit.audit_service import log_audit_event
    await log_audit_event(
        case_id=case_id,
        action="Evidence Uploaded",
        user="Investigator",
        status="Success",
        details=f"File '{file.filename}' uploaded successfully."
    )

    return UploadResponse(
        message="Evidence file uploaded successfully.",
        case_id=case_id,
        file=FileMetadata(**file_metadata),
    )
