import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from bson import ObjectId

from database.mongodb import get_database
from orchestrator.pipeline import start_pipeline
from pydantic import BaseModel

router = APIRouter()

from typing import List, Dict, Any


class ProcessResponse(BaseModel):
    status: str
    message: str
    case_id: str


async def _run_full_pipeline(case_id: str):
    """Background task: process files + rebuild reasoning data."""
    db = get_database()

    # Phase 1 – evidence extraction, classification, entity extraction
    try:
        result = await start_pipeline(case_id)
        print(f"[pipeline] Phase 1 done: {result.get('processed_files')} processed, {result.get('failed_files')} failed")
    except Exception as e:
        print(f"[pipeline] Phase 1 FAILED: {e}")
        return

    # Phase 2 – rebuild reasoning (graph, timeline, intelligence, summary)
    try:
        updated_case = await db["cases"].find_one({"_id": ObjectId(case_id)})
        if not updated_case:
            return

        files = updated_case.get("files", [])

        from services.reasoning.knowledge_graph import build_knowledge_graph
        graph = build_knowledge_graph(files)
        print(f"[pipeline] Knowledge graph: {len(graph.get('nodes', []))} nodes")

        from services.reasoning.correlation_engine import correlate_events
        from services.reasoning.timeline_engine import generate_timeline
        correlated_events = correlate_events(files)
        timeline = generate_timeline(correlated_events)
        print(f"[pipeline] Timeline: {len(timeline)} events")

        from services.orchestrator.intelligence_pipeline import run_intelligence_pipeline
        intelligence = run_intelligence_pipeline(files, timeline, graph)
        print(f"[pipeline] Intelligence keys: {list(intelligence.keys())}")

        # Generate LLM summary
        from services.intelligence.summary_engine import generate_summary
        try:
            summary = generate_summary(intelligence)
            if summary:
                intelligence["summary"] = summary
                print(f"[pipeline] Summary generated")
        except Exception as e:
            print(f"[pipeline] Summary generation failed (non-fatal): {e}")
            # Build a fallback summary from deterministic data
            contradictions = intelligence.get("contradictions", [])
            gaps = intelligence.get("gaps", [])
            intelligence["summary"] = {
                "case_overview": f"Investigation with {len(files)} evidence files processed.",
                "investigation_status": intelligence.get("readiness", {}).get("status", "Under Review"),
                "critical_findings": [str(c.get("reason", c))[:120] for c in contradictions[:3]],
                "major_events": [str(e.get("description", e))[:120] for e in timeline[:3]],
                "major_contradictions": [str(c.get("reason", c))[:120] for c in contradictions[:3]],
                "investigation_gaps": [str(g.get("reason", g))[:120] for g in gaps[:3]],
                "overall_assessment": f"Case has {len(files)} files, {len(timeline)} timeline events, and {len(contradictions)} detected contradictions."
            }

        # Persist all generated data
        await db["cases"].update_one(
            {"_id": ObjectId(case_id)},
            {"$set": {
                "timeline": timeline,
                "knowledge_graph": graph,
                "intelligence": intelligence,
                "processing_status": "completed"
            }}
        )
        print(f"[pipeline] Case updated in MongoDB")

    except Exception as e:
        print(f"[pipeline] Phase 2 FAILED: {e}")
        import traceback
        traceback.print_exc()
        await db["cases"].update_one(
            {"_id": ObjectId(case_id)},
            {"$set": {"processing_status": "failed"}}
        )
        return

    # Audit log
    try:
        from services.audit.audit_service import log_audit_event
        await log_audit_event(
            case_id=case_id,
            action="Evidence Processed",
            user="System",
            status="Success",
            details=f"Full pipeline completed for case {case_id}."
        )
    except Exception as e:
        print(f"[pipeline] Audit log failed (non-fatal): {e}")


@router.post(
    "/{case_id}",
    response_model=ProcessResponse,
    status_code=status.HTTP_200_OK,
    summary="Process all unprocessed evidence for a case (async background job)",
)
async def process_evidence(case_id: str, background_tasks: BackgroundTasks):
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

    # Mark as processing immediately so the UI can poll status
    await db["cases"].update_one(
        {"_id": ObjectId(case_id)},
        {"$set": {"processing_status": "processing"}}
    )

    # Kick off the heavy pipeline in the background — return 200 immediately
    background_tasks.add_task(_run_full_pipeline, case_id)

    return ProcessResponse(
        status="processing",
        message="Evidence processing started in the background. Poll the case for status updates.",
        case_id=case_id,
    )
