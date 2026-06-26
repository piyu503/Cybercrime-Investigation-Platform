import json
from typing import Dict, Any
from services.llm.ollama_client import generate_content, parse_json_response

from .prompts.recommendation_prompt import RECOMMENDATION_PROMPT


def generate_recommendations(intelligence_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate investigation recommendations from intelligence data using a local LLM."""
    payload = json.dumps(intelligence_data, indent=2, default=str)
    prompt = f"{RECOMMENDATION_PROMPT}\n\nDATA:\n{payload}"
    try:
        response_text = generate_content(prompt, json_mode=True)
        return parse_json_response(response_text, {"recommendations": []})
    except Exception as e:
        print(f"[recommendation_engine] Failed: {e}")
        return {"recommendations": []}
