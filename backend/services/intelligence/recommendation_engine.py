import os
import json
import google.generativeai as genai
from typing import Dict, Any

from .prompts.recommendation_prompt import RECOMMENDATION_PROMPT

def generate_recommendations(intelligence_data: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"recommendations": []}

    genai.configure(api_key=api_key)
    
    # We use Flash for speed.
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    payload = json.dumps(intelligence_data, indent=2, default=str)
    
    try:
        response = model.generate_content(
            f"{RECOMMENDATION_PROMPT}\n\nDATA:\n{payload}",
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Failed to generate recommendations: {e}")
        return {"recommendations": []}
