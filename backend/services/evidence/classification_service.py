import os
import json
import google.generativeai as genai
from prompts.evidence_prompt import EVIDENCE_CLASSIFICATION_PROMPT

def classify_evidence(text: str) -> dict:
    """
    Classifies the extracted text using Gemini 2.5 Flash.
    """
    if not text or not text.strip():
        return {"classification": "Unknown", "confidence": 0.0, "reasoning": "No text extracted."}
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not set. Returning dummy classification.")
        return {"classification": "Pending API Key", "confidence": 0.0, "reasoning": "Missing API Key"}

    genai.configure(api_key=api_key)
    
    # We use Flash for speed in classification
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = EVIDENCE_CLASSIFICATION_PROMPT.format(text=text[:10000]) # limit to 10k chars to save tokens if huge
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        
        result_json = response.text
        return json.loads(result_json)
    except Exception as e:
        print(f"Failed to classify evidence with Gemini: {e}")
        return {"classification": "Error", "confidence": 0.0, "reasoning": str(e)}
