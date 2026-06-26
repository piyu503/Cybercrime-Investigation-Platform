from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from database.mongodb import get_database
from services.orchestrator.intelligence_pipeline import run_intelligence_pipeline
from services.intelligence.summary_engine import generate_summary

router = APIRouter()

@router.post(
    "/intelligence/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Generate deterministic investigation intelligence"
)
async def generate_intelligence_route(case_id: str):
    db = get_database()
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")

    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    files = case.get("files", [])
    timeline = case.get("timeline", [])
    graph = case.get("knowledge_graph", {"nodes": [], "edges": []})

    # Run the pipeline
    intelligence = run_intelligence_pipeline(files, timeline, graph)

    # Save to case
    await db["cases"].update_one(
        {"_id": ObjectId(case_id)},
        {"$set": {"intelligence": intelligence}}
    )

    from services.audit.audit_service import log_audit_event
    await log_audit_event(
        case_id=case_id,
        action="Intelligence Generated",
        user="System",
        status="Success",
        details="Generated gaps, contradictions, readiness, and recommendations."
    )

    return {"message": "Intelligence generated successfully", "intelligence": intelligence}


@router.get(
    "/intelligence/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Get cached intelligence"
)
async def get_intelligence_route(case_id: str):
    db = get_database()
    if not ObjectId.is_valid(case_id):
        raise HTTPException(status_code=400, detail="Invalid case ID")
        
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    intel = case.get("intelligence", {})
    if not intel:
        return {}

    # Auto-generate or convert summary if missing or not structured correctly (e.g. legacy string summary)
    summary = intel.get("summary")
    if not summary or not isinstance(summary, dict):
        try:
            gen_summary = generate_summary(intel)
            if gen_summary and isinstance(gen_summary, dict) and gen_summary.get("case_overview"):
                intel["summary"] = gen_summary
            else:
                # Fallback: if there was a string summary, structure it properly so the frontend doesn't render empty cards
                orig_summary = str(summary) if summary else "No summary available."
                intel["summary"] = {
                    "case_overview": orig_summary,
                    "investigation_status": intel.get("readiness", {}).get("status", "Under Review"),
                    "critical_findings": [c.get("reason", "") for c in intel.get("contradictions", []) if c.get("reason")][:3],
                    "major_events": [],
                    "major_contradictions": [c.get("reason", "") for c in intel.get("contradictions", [])][:3],
                    "investigation_gaps": [g.get("reason", "") for g in intel.get("gaps", [])][:3],
                    "overall_assessment": orig_summary
                }
            
            await db["cases"].update_one(
                {"_id": ObjectId(case_id)},
                {"$set": {"intelligence": intel}}
            )
        except Exception as e:
            print(f"Failed to auto-generate summary on GET: {e}")
            
    return intel


@router.get(
    "/readiness/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Get cached readiness"
)
async def get_readiness_route(case_id: str):
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    intel = case.get("intelligence", {})
    return intel.get("readiness", {"overall_score": 0, "status": "Not Generated"})


@router.get(
    "/summary/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Generate Gemini investigation summary"
)
async def get_summary_route(case_id: str):
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    intel = case.get("intelligence", {})
    if not intel:
        raise HTTPException(status_code=400, detail="Must generate intelligence first")
        
    # Check if summary already exists
    if "summary" in intel:
        return intel["summary"]
        
    # Generate summary
    summary = generate_summary(intel)
    
    # Save it
    intel["summary"] = summary
    await db["cases"].update_one(
        {"_id": ObjectId(case_id)},
        {"$set": {"intelligence": intel}}
    )
    
    return summary
