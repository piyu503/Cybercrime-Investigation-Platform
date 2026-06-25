import os
import json
import google.generativeai as genai
from typing import Dict, Any

def generate_intelligence(graph: dict, timeline: list, case_context: dict) -> Dict[str, Any]:
    """
    Passes structured investigation data to Gemini to extract intelligence.
    """
    if not os.environ.get("GEMINI_API_KEY"):
        raise ValueError("GEMINI_API_KEY not set")
        
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are a Principal Investigation Analyst.
    Analyze the following structured evidence from an active case.
    
    Case Context: {json.dumps(case_context, default=str)[:1000]}
    Timeline Events: {json.dumps(timeline, default=str)[:3000]}
    Knowledge Graph Nodes: {len(graph.get("nodes", []))}
    Knowledge Graph Edges: {len(graph.get("edges", []))}
    
    Task:
    Detect contradictions.
    Identify investigation gaps.
    Recommend investigative actions.
    Generate a brief reasoning summary.
    
    Return your response strictly as valid JSON matching the format below. Do not use markdown blocks outside the JSON.
    
    {{
        "contradictions": ["Contradiction 1..."],
        "investigation_gaps": ["Gap 1..."],
        "recommended_actions": ["Action 1..."],
        "reasoning": "Summary of your reasoning..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Intelligence Generation failed: {e}")
        return {
            "contradictions": [],
            "investigation_gaps": ["Intelligence generation failed."],
            "recommended_actions": [],
            "reasoning": f"Error: {str(e)}"
        }
