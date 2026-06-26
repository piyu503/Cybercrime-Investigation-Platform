import json
from services.llm.ollama_client import generate_content, parse_json_response
from prompts.evidence_prompt import EVIDENCE_CLASSIFICATION_PROMPT


def classify_evidence(text: str) -> dict:
    """Classify extracted text using a local LLM via Ollama."""
    if not text or not text.strip():
        return {"classification": "Unknown", "confidence": 0.0, "reasoning": "No text extracted."}

    prompt = EVIDENCE_CLASSIFICATION_PROMPT.format(text=text[:10000])
    try:
        response_text = generate_content(prompt, json_mode=True)
        fallback = {"classification": "Unknown", "confidence": 0.0, "reasoning": "Could not parse LLM response."}
        return parse_json_response(response_text, fallback)
    except Exception as e:
        print(f"[classification_service] Failed: {e}")
        return {"classification": "Error", "confidence": 0.0, "reasoning": str(e)}
