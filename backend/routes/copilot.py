from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.copilot.copilot_service import ask_copilot
from services.audit.audit_service import log_audit_event

router = APIRouter()

class CopilotQuery(BaseModel):
    question: str

@router.post(
    "/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Ask the AI Investigation Copilot a question",
)
async def query_copilot(case_id: str, payload: CopilotQuery):
    try:
        response_text = await ask_copilot(case_id, payload.question)
        
        await log_audit_event(
            case_id=case_id,
            action="Copilot Query",
            user="System",
            status="Success",
            details=f"Asked Copilot: {payload.question[:50]}..."
        )
        
        return {"answer": response_text}
    except Exception as e:
        await log_audit_event(
            case_id=case_id,
            action="Copilot Query Failed",
            user="System",
            status="Failed",
            details=str(e)
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
