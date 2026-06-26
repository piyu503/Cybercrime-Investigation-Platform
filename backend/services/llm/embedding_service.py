import os
import requests
import math
from typing import List

OLLAMA_BASE_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

def generate_embedding(text: str) -> List[float]:
    """
    Generates a vector embedding for the given text using local Ollama.
    """
    if not text or not text.strip():
        return []
        
    try:
        model = os.getenv("LOCAL_LLM_MODEL", "gemma4:latest")
        payload = {
            "model": model,
            "prompt": text[:10000] # Truncate to avoid token limits
        }
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/embeddings",
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json().get("embedding", [])
    except Exception as e:
        print(f"[embedding_service] Failed to generate embedding: {e}")
        return []

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Calculates the cosine similarity between two vectors.
    """
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
        
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = math.sqrt(sum(a * a for a in vec1))
    magnitude2 = math.sqrt(sum(b * b for b in vec2))
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
        
    return dot_product / (magnitude1 * magnitude2)
