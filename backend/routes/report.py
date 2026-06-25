from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from bson import ObjectId
from database.mongodb import get_database
from services.report.report_generator import generate_court_report_pdf
from services.audit.audit_service import log_audit_event

router = APIRouter()

@router.get(
    "/{case_id}",
    summary="Download the Court Report as a PDF",
)
async def download_court_report(case_id: str):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")
        
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    pdf_buffer = generate_court_report_pdf(case)
    
    await log_audit_event(
        case_id=case_id,
        action="Report Downloaded",
        user="Investigator",
        status="Success",
        details="Downloaded official Court Report PDF."
    )
    
    headers = {
        'Content-Disposition': f'attachment; filename="Court_Report_{case_id}.pdf"'
    }
    
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)
