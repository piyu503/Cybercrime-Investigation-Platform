import json
from services.llm.ollama_client import generate_content, parse_json_response
from prompts.entity_prompt import ENTITY_EXTRACTION_PROMPT


EMPTY_ENTITIES = {
    "persons": [], "phones": [], "vehicles": [],
    "addresses": [], "dates": [], "times": [],
    "organizations": [], "emails": [], "money": [],
    "locations": [], "evidence_ids": [], "confidence": 0.0
}


def extract_entities(text: str) -> dict:
    """Extract structured forensic entities from text using a local LLM via Ollama."""
    if not text or not text.strip():
        return EMPTY_ENTITIES.copy()

    prompt = ENTITY_EXTRACTION_PROMPT.format(text=text[:15000])
    try:
        response_text = generate_content(prompt, json_mode=True)
        return parse_json_response(response_text, EMPTY_ENTITIES.copy())
    except Exception as e:
        print(f"[entity_service] Failed: {e}")
        return EMPTY_ENTITIES.copy()
