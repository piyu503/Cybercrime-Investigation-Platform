import json
from typing import Dict, Any
from services.llm.ollama_client import generate_content, parse_json_response


INTELLIGENCE_FALLBACK = {
    "contradictions": [],
    "investigation_gaps": ["Intelligence generation failed — check Ollama server."],
    "recommended_actions": [],
    "reasoning": "LLM not available."
}


def generate_intelligence(graph: dict, timeline: list, case_context: dict) -> Dict[str, Any]:
    """Generate investigation intelligence from graph, timeline, and case context using a local LLM."""

    prompt = f"""
You are a Principal Investigation Analyst working on a digital forensics case.
Analyze the following structured evidence and produce actionable intelligence.

Case Context: {json.dumps(case_context, default=str)[:1000]}
Timeline Events: {json.dumps(timeline, default=str)[:3000]}
Knowledge Graph Nodes: {len(graph.get("nodes", []))}
Knowledge Graph Edges: {len(graph.get("edges", []))}

Tasks:
1. Detect contradictions between evidence items.
2. Identify gaps in the investigation.
3. Recommend concrete investigative actions.
4. Write a brief reasoning summary.

Return ONLY valid raw JSON in this exact format:
{{
    "contradictions": ["Contradiction 1...", "Contradiction 2..."],
    "investigation_gaps": ["Gap 1...", "Gap 2..."],
    "recommended_actions": ["Action 1...", "Action 2..."],
    "reasoning": "Summary of your reasoning..."
}}
"""

    try:
        response_text = generate_content(prompt, json_mode=True)
        return parse_json_response(response_text, INTELLIGENCE_FALLBACK.copy())
    except Exception as e:
        print(f"[intelligence_engine] Failed: {e}")
        fallback = INTELLIGENCE_FALLBACK.copy()
        fallback["reasoning"] = f"Error: {str(e)}"
        return fallback
