from typing import Dict, Any, List

def validate_evidence(files: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Deterministic evidence validation engine evaluating health and completeness.
    """
    report = {
        "missing_evidence": [],
        "weak_evidence": [],
        "duplicate_evidence": [],
        "unverified_evidence": [],
        "incomplete_sections": []
    }
    
    if not files:
        report["incomplete_sections"].append("No evidence uploaded.")
        return report

    # Check for Diversity
    file_types = set([f.get("file_type", "").lower() for f in files])
    if len(file_types) < 2:
        report["weak_evidence"].append("Low evidence diversity (only one file type present). Relying entirely on single-source modalities can weaken court cases.")

    # Check Metadata Completeness
    for f in files:
        metadata = f.get("metadata", {})
        if not metadata or len(metadata.keys()) < 2:
            report["unverified_evidence"].append({
                "file_id": f.get("id", f.get("filename", "Unknown")),
                "reason": "Missing substantial metadata. Provenance cannot be fully verified."
            })

    # Check text extraction
    for f in files:
        if not f.get("extracted_text"):
            report["weak_evidence"].append(f"File '{f.get('filename', 'Unknown')}' has no extracted text. OCR/Extraction may have failed or file is empty.")

    return report
