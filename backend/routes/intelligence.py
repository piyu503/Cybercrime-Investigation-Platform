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

    return {"message": "Intelligence generated successfully", "intelligence": intelligence}


@router.get(
    "/intelligence/{case_id}",
    status_code=status.HTTP_200_OK,
    summary="Get cached intelligence"
)
async def get_intelligence_route(case_id: str):
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    return case.get("intelligence", {})


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
