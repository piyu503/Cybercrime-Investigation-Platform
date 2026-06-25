from typing import Dict, Any, List

from services.intelligence.contradiction_engine import detect_contradictions
from services.intelligence.gap_engine import detect_gaps
from services.intelligence.evidence_validation import validate_evidence
from services.intelligence.readiness_engine import calculate_readiness
from services.intelligence.recommendation_engine import generate_recommendations

def run_intelligence_pipeline(files: List[Dict[str, Any]], timeline: List[Dict[str, Any]], graph: Dict[str, Any]) -> Dict[str, Any]:
    """
    Orchestrates the entire intelligence generation process.
    """
    print("[Forensix] Running Intelligence Pipeline...")
    
    # 1. Deterministic Engines
    contradictions = detect_contradictions(graph, timeline)
    gaps = detect_gaps(files, graph)
    validation = validate_evidence(files)
    
    # 2. Readiness Scoring
    readiness = calculate_readiness(files, timeline, graph, contradictions, gaps, validation)
    
    # 3. Compile intermediate state for AI
    intermediate_state = {
        "timeline": timeline,
        "contradictions": contradictions,
        "gaps": gaps,
        "validation": validation,
        "readiness": readiness
    }
    
    # 4. Generative Engines
    recommendations_data = generate_recommendations(intermediate_state)
    
    # Return full intelligence payload
    return {
        "contradictions": contradictions,
        "gaps": gaps,
        "validation": validation,
        "readiness": readiness,
        "recommendations": recommendations_data.get("recommendations", [])
    }
