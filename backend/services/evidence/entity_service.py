import os
import json
import google.generativeai as genai
from prompts.entity_prompt import ENTITY_EXTRACTION_PROMPT

def extract_entities(text: str) -> dict:
    """
    Extracts structured entities from the text using Gemini 2.5 Flash.
    """
    empty_entities = {
        "persons": [], "phones": [], "vehicles": [], 
        "addresses": [], "dates": [], "times": [], 
        "organizations": [], "emails": []
    }
    
    if not text or not text.strip():
        return empty_entities
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not set. Returning empty entities.")
        return empty_entities

    genai.configure(api_key=api_key)
    
    # We use Flash for speed
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = ENTITY_EXTRACTION_PROMPT.format(text=text[:15000]) # limit to 15k chars
    
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
        print(f"Failed to extract entities with Gemini: {e}")
        return empty_entities
