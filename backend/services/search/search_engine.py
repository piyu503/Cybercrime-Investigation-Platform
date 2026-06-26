from typing import Dict, Any, List

def search_case_data(case: Dict[str, Any], query: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Performs a global search across all case collections (files, timeline, graph, intelligence).
    Returns grouped results.
    """
    original_query = query
    query = query.lower()
    
    results = {
        "files": [],
        "entities": [],
        "timeline": [],
        "intelligence": []
    }
    
    # Try to generate semantic embedding for query
    query_embedding = []
    try:
        from services.llm.embedding_service import generate_embedding, cosine_similarity
        query_embedding = generate_embedding(original_query)
    except Exception as e:
        print(f"[search] Embedding generation failed: {e}")
    
    # Search Files
    files = case.get("files", [])
    for f in files:
        filename = f.get("filename", "")
        file_type = f.get("filetype", f.get("file_type", ""))
        processed_data = f.get("processed_data", {})
        extracted_text = processed_data.get("extracted_text", "").lower()
        
        is_match = False
        match_reason = ""
        
        # Keyword Match
        if query in filename.lower() or query in file_type.lower() or query in extracted_text:
            is_match = True
            match_reason = "Keyword Match"
        
        # Semantic Match
        if not is_match and query_embedding:
            file_emb = processed_data.get("embedding", [])
            if file_emb:
                similarity = cosine_similarity(query_embedding, file_emb)
                if similarity > 0.60:
                    is_match = True
                    match_reason = f"Semantic Match ({similarity:.2f})"
                    
        if is_match:
            results["files"].append({
                "id": f.get("file_id", filename),
                "title": filename,
                "type": "File",
                "preview": match_reason
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
