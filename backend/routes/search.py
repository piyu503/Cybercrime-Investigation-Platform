from fastapi import APIRouter, HTTPException, Query, status
from bson import ObjectId
from database.mongodb import get_database
from services.search.search_engine import search_case_data

router = APIRouter()

@router.get(
    "/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Global search across a case",
)
async def global_search(case_id: str, q: str = Query(..., min_length=1)):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")
        
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    results = search_case_data(case, q)
    
    from services.audit.audit_service import log_audit_event
    await log_audit_event(
        case_id=case_id,
        action="Global Search",
        user="Investigator",
        status="Success",
        details=f"Searched for '{q}'"
    )
    
    return results
