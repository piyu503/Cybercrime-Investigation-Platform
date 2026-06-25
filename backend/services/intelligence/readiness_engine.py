from typing import Dict, Any, List

def calculate_readiness(
    files: List[Dict[str, Any]], 
    timeline: List[Dict[str, Any]], 
    graph: Dict[str, Any],
    contradictions: List[Dict[str, Any]],
    gaps: List[Dict[str, Any]],
    validation: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Deterministic readiness scoring engine without AI.
    """
    score = 0
    factors = {"positive": [], "negative": []}
    
    # 1. Base files
    if files:
        score += 10
        factors["positive"].append({"reason": "Base evidence files uploaded", "impact": "+10"})
    else:
        score -= 20
        factors["negative"].append({"reason": "No evidence uploaded", "impact": "-20"})
        
    file_names = " ".join([f.get("filename", "").lower() for f in files])
    if "fir" in file_names or "report" in file_names:
        score += 20
        factors["positive"].append({"reason": "Initial Report / FIR Present", "impact": "+20"})
        
    if "statement" in file_names:
        score += 15
        factors["positive"].append({"reason": "Witness Statement Present", "impact": "+15"})

    # 2. Timeline
    if len(timeline) > 5:
        score += 20
        factors["positive"].append({"reason": "Comprehensive Timeline Generated (>5 events)", "impact": "+20"})
    elif len(timeline) > 0:
        score += 10
        factors["positive"].append({"reason": "Timeline Generated", "impact": "+10"})

    # 3. Graph/Entities
    entities = [n for n in graph.get("nodes", []) if n.get("group") == "entity"]
    if len(entities) > 0:
        score += 15
        factors["positive"].append({"reason": f"Entities Extracted ({len(entities)} found)", "impact": "+15"})

    # 4. Contradictions Penalties
    for c in contradictions:
        severity = c.get("severity", "Medium")
        if severity == "Critical":
            score -= 15
            factors["negative"].append({"reason": f"Critical Contradiction: {c.get('reason')}", "impact": "-15"})
        else:
            score -= 5
            factors["negative"].append({"reason": f"Contradiction: {c.get('reason')}", "impact": "-5"})

    # 5. Gaps Penalties
    for g in gaps:
        score -= 10
        factors["negative"].append({"reason": f"Investigation Gap: {g.get('reason')}", "impact": "-10"})

    # 6. Validation Penalties
    for weak in validation.get("weak_evidence", []):
        score -= 2
        factors["negative"].append({"reason": f"Weak Evidence: {weak}", "impact": "-2"})

    # Cap score
    score = max(0, min(100, score))

    return {
        "overall_score": score,
        "status": "Ready for Prosecution" if score >= 80 else ("Needs Investigation" if score >= 50 else "Critical Deficiencies"),
        "positive_factors": factors["positive"],
        "negative_factors": factors["negative"]
    }
