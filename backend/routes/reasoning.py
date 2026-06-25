from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from database.mongodb import get_database
from services.reasoning.knowledge_graph import build_knowledge_graph
from services.reasoning.correlation_engine import correlate_events
from services.reasoning.timeline_engine import generate_timeline

router = APIRouter()

async def get_case_or_404(case_id: str):
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return db, case

@router.get("/knowledge-graph/{case_id}")
async def get_knowledge_graph(case_id: str):
    db, case = await get_case_or_404(case_id)
    files = case.get("files", [])
    graph = build_knowledge_graph(files)
    return graph

@router.post("/timeline/{case_id}")
async def create_timeline(case_id: str):
    db, case = await get_case_or_404(case_id)
    files = case.get("files", [])
    
    correlated_events = correlate_events(files)
    timeline = generate_timeline(correlated_events)
    
    await db["cases"].update_one(
        {"_id": ObjectId(case_id)},
        {"$set": {"timeline": timeline}}
    )
    
    from services.audit.audit_service import log_audit_event
    await log_audit_event(
        case_id=case_id,
        action="Timeline Generated",
        user="System",
        status="Success",
        details=f"Generated timeline with {len(timeline)} events."
    )
    
    return {"status": "success", "timeline": timeline}

@router.get("/timeline/{case_id}")
async def fetch_timeline(case_id: str):
    db, case = await get_case_or_404(case_id)
    timeline = case.get("timeline")
    if timeline is None:
        # Auto-generate if not exists
        files = case.get("files", [])
        correlated_events = correlate_events(files)
        timeline = generate_timeline(correlated_events)
        await db["cases"].update_one(
            {"_id": ObjectId(case_id)},
            {"$set": {"timeline": timeline}}
        )
    return timeline


