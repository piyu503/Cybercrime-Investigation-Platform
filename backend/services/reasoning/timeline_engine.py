from typing import List, Dict, Any
from dateutil.parser import parse

def generate_timeline(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Chronologically sorts correlated events to produce an investigation timeline.
    """
    
    def get_sort_key(event):
        ts = event.get("timestamp", "")
        try:
            return parse(ts, fuzzy=True).timestamp()
        except Exception:
            # If completely unparseable, push to end or assign a high default
            return float('inf')

    # Sort events based on parsed timestamp
    sorted_events = sorted(events, key=get_sort_key)
    
    # Optional: Enhance with "Reliability" metrics based on confidence
    for ev in sorted_events:
        conf = ev.get("confidence", 0.5)
        if conf >= 0.9:
            ev["reliability"] = "High"
        elif conf >= 0.7:
            ev["reliability"] = "Medium"
        else:
            ev["reliability"] = "Low"
            
    return sorted_events
