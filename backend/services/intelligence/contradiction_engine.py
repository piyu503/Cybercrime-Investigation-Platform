from typing import Dict, Any, List

def detect_contradictions(graph: Dict[str, Any], timeline: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Rule-based engine to detect investigative contradictions from structured evidence.
    """
    contradictions = []
    
    # 1. Check for Duplicate Evidence (same file hash or identical metadata, simplified for now)
    # We look at nodes of group 'file' and check if they share the exact same names (heuristic for duplicate uploads)
    files = [node for node in graph.get("nodes", []) if node.get("group") == "file"]
    seen_names = {}
    for f in files:
        name = f.get("label", "")
        if name in seen_names:
            contradictions.append({
                "severity": "High",
                "confidence": "98%",
                "reason": f"Duplicate evidence detected: '{name}' appears multiple times.",
                "supporting_evidence": [seen_names[name], f.get("id")],
                "related_entities": [f.get("id")],
                "related_timeline_events": [],
                "suggested_verification": "Review files to confirm they are exact duplicates. Remove one if confirmed to clean the timeline."
            })
        else:
            seen_names[name] = f.get("id")

    # 2. Check for Conflicting Locations for the same person in the timeline
    # A person shouldn't be in two distinct locations at the exact same time
    # We will build a simple timeline map per person
    person_activity = {}
    for event in timeline:
        timestamp = event.get("timestamp")
        locations = [ent["value"] for ent in event.get("entities", []) if ent["type"] == "Location"]
        persons = [ent["value"] for ent in event.get("entities", []) if ent["type"] == "Person"]
        
        if timestamp and locations and persons:
            # For simplicity, we just check exact timestamps in this heuristic
            for person in persons:
                for location in locations:
                    if person not in person_activity:
                        person_activity[person] = {}
                    
                    if timestamp in person_activity[person]:
                        existing_location = person_activity[person][timestamp]["location"]
                        if existing_location != location:
                            contradictions.append({
                                "severity": "Critical",
                                "confidence": "85%",
                                "reason": f"Location mismatch: {person} is reported at '{existing_location}' and '{location}' at the exact same time.",
                                "supporting_evidence": [],
                                "related_entities": [person, location, existing_location],
                                "related_timeline_events": [
                                    person_activity[person][timestamp]["event_id"],
                                    event.get("id")
                                ],
                                "suggested_verification": "Cross-reference the timestamps of both pieces of evidence. One may have an incorrect timezone or metadata."
                            })
                    else:
                        person_activity[person][timestamp] = {
                            "location": location,
                            "event_id": event.get("id")
                        }

    # 3. Check for Identity mismatches (e.g. multiple distinct phone numbers for the same person across small timeline)
    # This requires more complex logic, but we will add a placeholder for extensible rules.
    
    return contradictions
