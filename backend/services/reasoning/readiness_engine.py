from typing import Dict, Any, List

def calculate_readiness(files: List[Dict[str, Any]], intelligence: Dict[str, Any], timeline: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates an explainable investigation readiness score using deterministic heuristics.
    """
    score = 0
    breakdown = []
    missing_evidence = []
    
    # Analyze classifications
    classifications = [f.get("processed_data", {}).get("classification", "").lower() for f in files if f.get("is_processed")]
    
    # 1. FIR Present
    if any("fir" in c for c in classifications):
        score += 20
        breakdown.append({"rule": "FIR Present", "score": 20, "reason": "First Information Report establishes the legal foundation."})
    else:
        missing_evidence.append("First Information Report (FIR)")
        breakdown.append({"rule": "Missing FIR", "score": -10, "reason": "No FIR found in evidence."})

    # 2. Witness Statements
    if any("statement" in c or "witness" in c for c in classifications):
        score += 15
        breakdown.append({"rule": "Witness Statement", "score": 15, "reason": "Corroborating witness statements found."})
    else:
        missing_evidence.append("Witness Statements")
        
    # 3. Call Logs
    if any("call" in c or "cdr" in c for c in classifications):
        score += 10
        breakdown.append({"rule": "Call Log", "score": 10, "reason": "Call Detail Records found."})
        
    # 4. Location Data
    # Check if we have extracted locations across files
    has_locations = any(f.get("processed_data", {}).get("entities", {}).get("locations", []) for f in files if f.get("is_processed"))
    if has_locations:
        score += 10
        breakdown.append({"rule": "Location Verified", "score": 10, "reason": "Geographic locations identified in evidence."})
        
    # 5. Timeline Completion
    if len(timeline) >= 3:
        score += 20
        breakdown.append({"rule": "Timeline Complete", "score": 20, "reason": "Sufficient chronological events to form a timeline."})
    else:
        breakdown.append({"rule": "Sparse Timeline", "score": 0, "reason": "Not enough events to establish a robust timeline."})
        
    # 6. Contradictions Deduction
    contradictions = intelligence.get("contradictions", [])
    if contradictions:
        deduction = min(len(contradictions) * 5, 15)
        score -= deduction
        breakdown.append({"rule": "Contradictions", "score": -deduction, "reason": f"Found {len(contradictions)} conflicting evidence points."})
        
    # 7. Investigation Gaps Deduction
    gaps = intelligence.get("investigation_gaps", [])
    if gaps:
        deduction = min(len(gaps) * 5, 10)
        score -= deduction
        breakdown.append({"rule": "Missing Evidence", "score": -deduction, "reason": f"Identified {len(gaps)} investigation gaps."})
        
    # Normalize score
    final_score = max(0, min(100, score))
    
    return {
        "overall_score": final_score,
        "breakdown": breakdown,
        "missing_evidence": missing_evidence,
        "improvement_suggestions": intelligence.get("recommended_actions", [])
    }
