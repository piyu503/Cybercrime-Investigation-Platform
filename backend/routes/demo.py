from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime
from database.mongodb import get_database
from services.audit.audit_service import log_audit_event

router = APIRouter()

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create a sample investigation case (Demo Mode)",
)
async def generate_demo_case():
    db = get_database()

    new_case = {
        "case_name": "Op Phantom - Financial Syndicate",
        "description": "An investigation into a high-level cyber financial syndicate involving wire fraud and illegal cryptocurrency mixing. Key suspect: Arthur Vance.",
        "created_at": datetime.utcnow(),
        "files": [
            {
                "file_id": "demo-fir-01",
                "filename": "FIR_091_Cyber_Fraud.pdf",
                "file_type": "application/pdf",
                "status": "processed",
                "metadata": {
                    "text_content": "FIRST INFORMATION REPORT\nIncident: Wire Fraud\nSuspect: Arthur Vance\nDetails: Subject was seen transferring $10M offshore via shell accounts on 2026-05-12.",
                    "extracted_entities": [
                        {"value": "Arthur Vance", "type": "Person"},
                        {"value": "$10M", "type": "Money"},
                        {"value": "2026-05-12", "type": "Date"}
                    ]
                }
            },
            {
                "file_id": "demo-chat-01",
                "filename": "WhatsApp_Export_Vance.txt",
                "file_type": "text/plain",
                "status": "processed",
                "metadata": {
                    "text_content": "[2026-05-13 14:00] Vance: Did the transfer go through to the Cayman account?\n[2026-05-13 14:02] Unknown: Yes, funds cleared. Wash complete.",
                    "extracted_entities": [
                        {"value": "Vance", "type": "Person"},
                        {"value": "Cayman account", "type": "Location"},
                        {"value": "2026-05-13 14:00", "type": "Date"}
                    ]
                }
            },
            {
                "file_id": "demo-stmt-01",
                "filename": "Witness_Statement_01.pdf",
                "file_type": "application/pdf",
                "status": "processed",
                "metadata": {
                    "text_content": "WITNESS STATEMENT\nName: Sarah Jenkins\nStatement: I saw Arthur Vance in Geneva on 2026-05-12, nowhere near the transaction desk. He was attending a conference.",
                    "extracted_entities": [
                        {"value": "Sarah Jenkins", "type": "Person"},
                        {"value": "Arthur Vance", "type": "Person"},
                        {"value": "Geneva", "type": "Location"},
                        {"value": "2026-05-12", "type": "Date"}
                    ]
                }
            }
        ],
        "timeline": [
            {
                "id": "tl-1",
                "timestamp": "2026-05-12",
                "description": "FIR reports Arthur Vance transferred $10M offshore.",
                "entities": [{"type": "Person", "value": "Arthur Vance"}],
                "confidence": 0.9,
                "source_files": ["demo-fir-01"]
            },
            {
                "id": "tl-2",
                "timestamp": "2026-05-12",
                "description": "Witness Sarah Jenkins claims Arthur Vance was in Geneva.",
                "entities": [{"type": "Person", "value": "Arthur Vance"}, {"type": "Location", "value": "Geneva"}],
                "confidence": 0.85,
                "source_files": ["demo-stmt-01"]
            },
            {
                "id": "tl-3",
                "timestamp": "2026-05-13 14:00",
                "description": "WhatsApp chat confirms funds cleared to Cayman account.",
                "entities": [{"type": "Person", "value": "Vance"}, {"type": "Location", "value": "Cayman account"}],
                "confidence": 0.95,
                "source_files": ["demo-chat-01"]
            }
        ],
        "knowledge_graph": {
            "nodes": [
                {"id": "Vance", "label": "Person: Arthur Vance", "group": "entity"},
                {"id": "Geneva", "label": "Location: Geneva", "group": "entity"},
                {"id": "Cayman", "label": "Location: Cayman account", "group": "entity"},
                {"id": "Money", "label": "Money: $10M", "group": "entity"},
                {"id": "Jenkins", "label": "Person: Sarah Jenkins", "group": "entity"},
                {"id": "f1", "label": "FIR_091", "group": "file"},
                {"id": "f2", "label": "WhatsApp_Export", "group": "file"},
                {"id": "f3", "label": "Witness_Statement", "group": "file"}
            ],
            "edges": [
                {"source": "f1", "target": "Vance", "label": "mentions"},
                {"source": "f1", "target": "Money", "label": "mentions"},
                {"source": "f2", "target": "Vance", "label": "mentions"},
                {"source": "f2", "target": "Cayman", "label": "mentions"},
                {"source": "f3", "target": "Vance", "label": "mentions"},
                {"source": "f3", "target": "Jenkins", "label": "mentions"},
                {"source": "f3", "target": "Geneva", "label": "mentions"},
                {"source": "Vance", "target": "Money", "label": "transferred (suspected)"},
                {"source": "Vance", "target": "Cayman", "label": "associated with"}
            ]
        },
        "intelligence": {
            "summary": "Op Phantom investigates a sophisticated $10M offshore wire fraud allegedly orchestrated by Arthur Vance. Evidence includes the FIR and encrypted WhatsApp logs. However, a sworn witness statement places Vance in Geneva on the day of the transfer, raising significant alibi considerations.",
            "readiness": {
                "overall_score": 65,
                "status": "Needs Verification",
                "details": {
                    "Evidence Volume": "Low",
                    "Timeline Coherence": "Medium",
                    "Entity Linkage": "Strong"
                }
            },
            "contradictions": [
                {
                    "severity": "Critical",
                    "confidence": "95%",
                    "reason": "Location mismatch: Arthur Vance is reported transferring money offshore, but a witness statement places him physically in Geneva on the same day.",
                    "supporting_evidence": ["demo-fir-01", "demo-stmt-01"],
                    "related_entities": ["Arthur Vance", "Geneva"],
                    "related_timeline_events": ["tl-1", "tl-2"],
                    "suggested_verification": "Subpoena flight records and hotel receipts for Arthur Vance in Geneva on 2026-05-12."
                }
            ],
            "gaps": [
                {
                    "reason": "Financial context detected but official Bank Statements are missing to prove the $10M transfer.",
                    "severity": "Critical",
                    "recommended_evidence": "Upload official bank statements or transaction ledgers.",
                    "priority": "High",
                    "affected_stage": "Financial Profiling",
                    "confidence": "90%",
                    "supporting_evidence": ["demo-fir-01"],
                    "related_entities": ["Money: $10M"],
                    "related_timeline_events": ["tl-1"]
                },
                {
                    "reason": "Phone numbers / Communications detected but Call Detail Records (CDR) are missing.",
                    "severity": "High",
                    "recommended_evidence": "Subpoena and upload CDRs for Arthur Vance's phone to map communication networks.",
                    "priority": "High",
                    "affected_stage": "Evidence Collection",
                    "confidence": "95%",
                    "supporting_evidence": ["demo-chat-01"],
                    "related_entities": ["Arthur Vance"],
                    "related_timeline_events": ["tl-3"]
                }
            ],
            "recommendations": [
                {
                    "action": "Subpoena Bank Records",
                    "type": "Evidence Collection",
                    "priority": "High",
                    "reason": "Crucial to verify the $10M transfer mentioned in the FIR.",
                    "confidence": "99%",
                    "related_timeline_events": ["tl-1"],
                    "related_entities": ["$10M"],
                    "supporting_evidence": ["demo-fir-01"],
                    "expected_outcome": "Confirm destination of funds (Cayman account)."
                },
                {
                    "action": "Interview Sarah Jenkins",
                    "type": "Interview",
                    "priority": "High",
                    "reason": "Jenkins provides a strong alibi for Vance that contradicts the FIR timeline.",
                    "confidence": "90%",
                    "related_timeline_events": ["tl-2"],
                    "related_entities": ["Sarah Jenkins", "Arthur Vance", "Geneva"],
                    "supporting_evidence": ["demo-stmt-01"],
                    "expected_outcome": "Verify the authenticity of the alibi."
                }
            ]
        }
    }

    result = await db["cases"].insert_one(new_case)
    case_id = str(result.inserted_id)

    await log_audit_event(
        case_id=case_id,
        action="Case Created",
        user="Demo Script",
        status="Success",
        details="Sample investigation case populated successfully."
    )

    return {"message": "Demo case generated.", "case_id": case_id}
