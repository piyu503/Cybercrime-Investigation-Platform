import json
from typing import Dict, Any
from services.llm.ollama_client import generate_content, parse_json_response

from .prompts.summary_prompt import SUMMARY_PROMPT


def generate_summary(intelligence_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a structured investigation summary from intelligence data using a local LLM."""
    payload = json.dumps(intelligence_data, indent=2, default=str)
    prompt = f"{SUMMARY_PROMPT}\n\nDATA:\n{payload}"
    try:
        response_text = generate_content(prompt, json_mode=True)
        return parse_json_response(response_text, {})
    except Exception as e:
        print(f"[summary_engine] Failed: {e}")
        return {}
