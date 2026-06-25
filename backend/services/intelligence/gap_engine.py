from typing import Dict, Any, List

def detect_gaps(files: List[Dict[str, Any]], graph: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Rule-based engine to detect investigation gaps.
    """
    gaps = []
    
    # Extract file types and entities present in the case
    file_types = [f.get("file_type", "").lower() for f in files]
    file_names = " ".join([f.get("filename", "").lower() for f in files])
    
    entities = [n for n in graph.get("nodes", []) if n.get("group") == "entity"]
    entity_types = {e.get("label", "").split(":")[0].strip() for e in entities}  # e.g., "Person", "Phone", "Vehicle"
    
    # 1. FIR / Initial Report Check
    has_fir = any("fir" in fn or "report" in fn or "statement" in fn for fn in file_names.split())
    if not has_fir:
        gaps.append({
            "reason": "Missing Initial Report (FIR / Incident Report). Investigation lacks formal starting document.",
            "severity": "Critical",
            "recommended_evidence": "Obtain and upload the official First Information Report or incident log.",
            "priority": "High",
            "affected_stage": "Initial Investigation",
            "confidence": "90%",
            "supporting_evidence": [],
            "related_entities": [],
            "related_timeline_events": []
        })

    # 2. Phone Entity Gap
    phone_entities = [e.get("label", "") for e in entities if e.get("label", "").startswith("Phone")]
    if "Phone" in entity_types or "PhoneNumber" in entity_types:
        has_cdr = any("cdr" in fn or "call" in fn or "log" in fn for fn in file_names.split())
        if not has_cdr:
            gaps.append({
                "reason": "Phone numbers detected but Call Detail Records (CDR) are missing.",
                "severity": "High",
                "recommended_evidence": "Subpoena and upload CDRs for the identified phone numbers to map communication networks.",
                "priority": "High",
                "affected_stage": "Evidence Collection",
                "confidence": "95%",
                "supporting_evidence": [],
                "related_entities": phone_entities[:5], # List top 5 phones
                "related_timeline_events": []
            })

    # 3. Vehicle Entity Gap
    vehicle_entities = [e.get("label", "") for e in entities if e.get("label", "").startswith("Vehicle")]
    if "Vehicle" in entity_types or "LicensePlate" in entity_types:
        has_reg = any("registration" in fn or "dmv" in fn or "rto" in fn for fn in file_names.split())
        if not has_reg:
            gaps.append({
                "reason": "Vehicles detected but Registration Records are missing.",
                "severity": "Medium",
                "recommended_evidence": "Upload vehicle ownership and registration records to link subjects to the vehicle.",
                "priority": "Medium",
                "affected_stage": "Subject Identification",
                "confidence": "85%",
                "supporting_evidence": [],
                "related_entities": vehicle_entities[:5],
                "related_timeline_events": []
            })

    # 4. Digital Evidence Gap (if cyber-related)
    if any(keyword in file_names for keyword in ["fraud", "transaction", "crypto", "bank"]):
        has_bank = any("bank" in fn or "statement" in fn or "ledger" in fn for fn in file_names.split())
        if not has_bank:
            gaps.append({
                "reason": "Financial context detected but Bank Statements are missing.",
                "severity": "Critical",
                "recommended_evidence": "Upload official bank statements or transaction ledgers.",
                "priority": "High",
                "affected_stage": "Financial Profiling",
                "confidence": "90%",
                "supporting_evidence": [fn for fn in file_names.split() if any(k in fn for k in ["fraud", "transaction", "crypto", "bank"])][:3],
                "related_entities": [],
                "related_timeline_events": []
            })

    return gaps
