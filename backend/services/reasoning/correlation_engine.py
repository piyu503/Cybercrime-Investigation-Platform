import json
from typing import List, Dict, Any
from services.llm.ollama_client import generate_content, parse_json_response
from prompts.timeline_prompt import TIMELINE_EXTRACTION_PROMPT

def _process_single_file(file_obj: Dict[str, Any]) -> Any:
    processed_data = file_obj.get("processed_data", {})
    filename = file_obj.get("filename", "Unknown")
    raw_text = processed_data.get("extracted_text", "")
    
    if not raw_text or not raw_text.strip():
        meta = processed_data.get("metadata", {})
        fallback_time = meta.get("created_time", "")
        return {
            "timestamp": fallback_time,
            "event_type": "Document Discovered",
            "description": f"Evidence '{filename}' without extractable text.",
            "supporting_evidence": [filename],
            "related_entities": _flatten_entities(processed_data.get("entities", {})),
            "locations": [],
            "confidence": 0.8
        }

    prompt = TIMELINE_EXTRACTION_PROMPT.format(text=raw_text[:15000])
    try:
        response_text = generate_content(prompt, json_mode=True)
        ai_result = parse_json_response(response_text, {"events": []})
        extracted_events = ai_result.get("events", [])
        for ev in extracted_events:
            ev["supporting_evidence"] = [filename]
        return extracted_events
            
    except Exception as e:
        print(f"[correlation_engine] AI extraction failed for {filename}: {e}")
        fallback_time = processed_data.get("metadata", {}).get("created_time", "")
        return {
            "timestamp": fallback_time,
            "event_type": "Extraction Failed",
            "description": f"AI extraction failed for '{filename}'.",
            "supporting_evidence": [filename],
            "related_entities": _flatten_entities(processed_data.get("entities", {})),
            "locations": [],
            "confidence": 0.5
        }

def correlate_events(files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    AI-powered evidence correlation engine.
    Uses LLM to extract highly accurate events from raw text concurrently.
    """
    events = []
    import concurrent.futures
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_file = {executor.submit(_process_single_file, f): f for f in files if f.get("is_processed")}
        for future in concurrent.futures.as_completed(future_to_file):
            result = future.result()
            if isinstance(result, list):
                events.extend(result)
            elif isinstance(result, dict):
                events.append(result)

    # Merge events that have the exact same timestamp and location
    merged_events = []
    event_map = {}
    
    for ev in events:
        timestamp = ev.get("timestamp", "Unknown")
        locations = ev.get("locations", [])
        loc_str = ",".join(locations) if locations else "None"
        key = f"{timestamp}_{loc_str}"
        
        if key not in event_map:
            event_map[key] = ev
        else:
            # Merge
            existing = event_map[key]
            # Ensure supporting_evidence exists
            if "supporting_evidence" not in existing:
                existing["supporting_evidence"] = []
            if "supporting_evidence" not in ev:
                ev["supporting_evidence"] = []
                
            existing["supporting_evidence"] = list(set(existing["supporting_evidence"] + ev["supporting_evidence"]))
            
            if "related_entities" not in existing:
                existing["related_entities"] = []
            if "related_entities" not in ev:
                ev["related_entities"] = []
                
            existing["related_entities"] = list(set(existing["related_entities"] + ev["related_entities"]))
            
            # Combine descriptions nicely if they differ significantly
            if existing.get("description", "") != ev.get("description", ""):
                existing["description"] = existing.get("description", "") + f" | {ev.get('description', '')}"
            
    return list(event_map.values())

def _flatten_entities(entities: Dict[str, Any]) -> List[str]:
    flat = []
    if not isinstance(entities, dict):
        return flat
    for k, v in entities.items():
        if k != "confidence" and isinstance(v, list):
            flat.extend(v)
    return list(set(flat))
