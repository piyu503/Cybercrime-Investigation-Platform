from typing import List, Dict, Any

def correlate_events(files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Deterministic rules-based evidence correlation engine.
    Merges entities and files into high-level 'Events'.
    """
    events = []
    
    # Simple Event heuristic:
    # Any combination of a Date and/or Time in a file constitutes an Event.
    # We group entities present in the same file into that event.
    
    for file_obj in files:
        if not file_obj.get("is_processed"):
            continue
            
        processed_data = file_obj.get("processed_data", {})
        entities = processed_data.get("entities", {})
        filename = file_obj.get("filename", "Unknown")
        
        dates = entities.get("dates", [])
        times = entities.get("times", [])
        
        if not dates and not times:
            # If no explicit date/time, treat the file upload/creation time as the event timestamp
            # Or just create a generic event for the file.
            meta = processed_data.get("metadata", {})
            fallback_time = meta.get("created_time", "")
            events.append({
                "timestamp": fallback_time,
                "event_type": "Document Discovered",
                "description": f"Evidence '{filename}' without explicit dates.",
                "supporting_evidence": [filename],
                "related_entities": _flatten_entities(entities),
                "locations": entities.get("locations", []),
                "confidence": 0.8
            })
            continue
            
        # If dates are found, create an event for each date/time combo
        for date in dates:
            time_str = times[0] if times else "00:00:00"
            
            events.append({
                "timestamp": f"{date} {time_str}".strip(),
                "event_type": "Recorded Activity",
                "description": f"Activity recorded in '{filename}'.",
                "supporting_evidence": [filename],
                "related_entities": _flatten_entities(entities),
                "locations": entities.get("locations", []),
                "confidence": 0.9
            })

    # Merge events that have the exact same timestamp and location
    # (Simplified deterministic merging rule)
    merged_events = []
    event_map = {}
    
    for ev in events:
        key = f"{ev['timestamp']}_{','.join(ev['locations'])}"
        if key not in event_map:
            event_map[key] = ev
        else:
            # Merge
            existing = event_map[key]
            existing["supporting_evidence"] = list(set(existing["supporting_evidence"] + ev["supporting_evidence"]))
            existing["related_entities"] = list(set(existing["related_entities"] + ev["related_entities"]))
            existing["description"] = f"Correlated multiple activities involving {len(existing['supporting_evidence'])} files."
            
    return list(event_map.values())

def _flatten_entities(entities: Dict[str, Any]) -> List[str]:
    flat = []
    for k, v in entities.items():
        if k != "confidence" and isinstance(v, list):
            flat.extend(v)
    return list(set(flat))
