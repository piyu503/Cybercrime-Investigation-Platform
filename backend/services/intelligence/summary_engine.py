import os
import json
import google.generativeai as genai
from typing import Dict, Any

from .prompts.summary_prompt import SUMMARY_PROMPT

def generate_summary(intelligence_data: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {}

    genai.configure(api_key=api_key)
    
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    payload = json.dumps(intelligence_data, indent=2, default=str)
    
    try:
        response = model.generate_content(
            f"{SUMMARY_PROMPT}\n\nDATA:\n{payload}",
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Failed to generate summary: {e}")
        return {}
