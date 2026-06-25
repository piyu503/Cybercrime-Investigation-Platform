from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from database.mongodb import get_database
from services.audit.audit_service import get_audit_trail

router = APIRouter()

@router.get(
    "/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Retrieve audit trail for a case",
)
async def fetch_audit_trail(case_id: str):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")
        
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    logs = await get_audit_trail(case_id)
    return logs
