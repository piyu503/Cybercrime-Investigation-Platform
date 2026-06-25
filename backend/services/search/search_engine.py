from typing import Dict, Any, List

def search_case_data(case: Dict[str, Any], query: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Performs a global search across all case collections (files, timeline, graph, intelligence).
    Returns grouped results.
    """
    query = query.lower()
    
    results = {
        "files": [],
        "entities": [],
        "timeline": [],
        "intelligence": []
    }
    
    # Search Files
    files = case.get("files", [])
    for f in files:
        if query in f.get("filename", "").lower() or query in f.get("file_type", "").lower() or query in f.get("metadata", {}).get("text_content", "").lower():
            results["files"].append({
                "id": f.get("file_id"),
                "title": f.get("filename"),
                "type": "File",
                "preview": f.get("file_type")
            })
            
    # Search Knowledge Graph (Entities)
    graph = case.get("knowledge_graph", {})
    nodes = graph.get("nodes", [])
    for n in nodes:
        if n.get("group") == "entity" and query in n.get("label", "").lower():
            results["entities"].append({
                "id": n.get("id"),
                "title": n.get("label"),
                "type": "Entity",
                "preview": "Entity matched"
            })
            
    # Search Timeline
    timeline = case.get("timeline", [])
    for event in timeline:
        description = event.get("description", "")
        if query in description.lower():
            results["timeline"].append({
                "id": event.get("id"),
                "title": f"Event on {event.get('timestamp')}",
                "type": "Timeline Event",
                "preview": description[:100] + "..." if len(description) > 100 else description
            })
            
    # Search Intelligence (Recommendations, Contradictions, Gaps)
    intel = case.get("intelligence", {})
    
    for rec in intel.get("recommendations", []):
        if query in rec.get("action", "").lower() or query in rec.get("reason", "").lower():
            results["intelligence"].append({
                "id": "rec_" + str(hash(rec.get("action"))),
                "title": "Recommendation: " + rec.get("action"),
                "type": "Recommendation",
                "preview": rec.get("reason", "")
            })
            
    for con in intel.get("contradictions", []):
        if query in con.get("reason", "").lower():
            results["intelligence"].append({
                "id": "con_" + str(hash(con.get("reason"))),
                "title": "Contradiction Detected",
                "type": "Contradiction",
                "preview": con.get("reason")
            })
            
    for gap in intel.get("gaps", []):
        if query in gap.get("reason", "").lower() or query in gap.get("recommended_evidence", "").lower():
            results["intelligence"].append({
                "id": "gap_" + str(hash(gap.get("reason"))),
                "title": "Investigation Gap",
                "type": "Gap",
                "preview": gap.get("reason")
            })
            
    return results
