from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime

from database.mongodb import get_database
from models.case import CreateCaseRequest, CreateCaseResponse, CaseOut
from services.audit.audit_service import log_audit_event

router = APIRouter()


def _serialize_case(doc: dict) -> dict:
    """Convert MongoDB document to a serializable dict."""
    doc["_id"] = str(doc["_id"])
    return doc


# ─── POST /cases ──────────────────────────────────────────────────────────────

@router.post(
    "/",
    response_model=CreateCaseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new investigation case",
)
async def create_case(payload: CreateCaseRequest):
    db = get_database()

    new_case = {
        "case_name": payload.case_name,
        "description": payload.description,
        "created_at": datetime.utcnow(),
        "files": [],
    }

    result = await db["cases"].insert_one(new_case)
    case_id = str(result.inserted_id)
    
    await log_audit_event(
        case_id=case_id,
        action="Case Created",
        user="System",
        status="Success",
        details=f"Case '{payload.case_name}' initialized."
    )

    return CreateCaseResponse(case_id=case_id)


# ─── GET /cases ───────────────────────────────────────────────────────────────

@router.get(
    "/",
    response_model=list[CaseOut],
    status_code=status.HTTP_200_OK,
    summary="Retrieve all investigation cases",
)
async def get_all_cases():
    db = get_database()
    cursor = db["cases"].find().sort("created_at", -1)
    cases = []
    async for doc in cursor:
        cases.append(_serialize_case(doc))
    return cases


# ─── GET /cases/{id} ──────────────────────────────────────────────────────────

@router.get(
    "/{case_id}",
    response_model=CaseOut,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a single case by ID",
)
async def get_case(case_id: str):
    db = get_database()

    if not ObjectId.is_valid(case_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{case_id}' is not a valid case ID.",
        )

    doc = await db["cases"].find_one({"_id": ObjectId(case_id)})

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with ID '{case_id}' was not found.",
        )

    return _serialize_case(doc)


# ─── GET /cases/{id}/audit ────────────────────────────────────────────────────

@router.get(
    "/{case_id}/audit",
    response_model=list[dict],
    status_code=status.HTTP_200_OK,
    summary="Retrieve the audit trail for a case",
)
async def get_case_audit(case_id: str):
    db = get_database()

    if not ObjectId.is_valid(case_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{case_id}' is not a valid case ID.",
        )

    # Check if case exists
    existing_case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not existing_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case with ID '{case_id}' was not found.",
        )

    from services.audit.audit_service import get_audit_trail
    return await get_audit_trail(case_id)
