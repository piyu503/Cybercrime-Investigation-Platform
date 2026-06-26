import os
import json
import re
import requests
import asyncio
from functools import partial


OLLAMA_BASE_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")


def _extract_json(text: str) -> str:
    """Strip markdown code fences and extract the first JSON block from text."""
    if isinstance(text, bytes):
        text = text.decode("utf-8")
        
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]+?)```", text)
    if match:
        return match.group(1).strip()
    return text


def is_ollama_running() -> bool:
    """Return True if the Ollama server is reachable."""
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        return resp.status_code == 200
    except Exception:
        return False


def list_models() -> list:
    """Return a list of model names available in Ollama."""
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        resp.raise_for_status()
        return [m["name"] for m in resp.json().get("models", [])]
    except Exception:
        return []


def generate_content(prompt: str, model: str = None, json_mode: bool = False) -> str:
    """Generate text from a local Ollama model (synchronous, blocking).

    Args:
        prompt:     The prompt to send.
        model:      Model name. Defaults to LOCAL_LLM_MODEL env var or 'gemma4:latest'.
        json_mode:  If True, appends a JSON instruction and strips markdown fences.

    Returns:
        The raw (or fence-stripped) text response.

    Raises:
        RuntimeError if Ollama is not running or returns an error.
    """
    if model is None:
        model = os.getenv("LOCAL_LLM_MODEL", "gemma4:latest")

    if not is_ollama_running():
        raise RuntimeError(
            "Ollama is not running. Start it with: ollama serve\n"
            f"Then ensure the model is pulled: ollama pull {model}"
        )

    full_prompt = prompt
    if json_mode:
        full_prompt = (
            prompt.rstrip()
            + "\n\nIMPORTANT: Return ONLY valid raw JSON. No markdown. No explanation. No code fences."
        )

    payload = {
        "model": model,
        "prompt": full_prompt,
        "stream": False,
    }

    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=300,   # 5 minutes max per call
        )
        resp.raise_for_status()
        raw = resp.json().get("response", "")
        if json_mode:
            raw = _extract_json(raw)
        return raw
    except requests.RequestException as e:
        raise RuntimeError(f"Ollama generation failed: {e}")


async def generate_content_async(prompt: str, model: str = None, json_mode: bool = False) -> str:
    """Async wrapper: runs generate_content in a thread pool so it doesn't block the event loop."""
    loop = asyncio.get_event_loop()
    fn = partial(generate_content, prompt, model, json_mode)
    return await loop.run_in_executor(None, fn)


def parse_json_response(response_text: str, fallback: dict) -> dict:
    """Attempt to parse JSON from an LLM response, returning fallback on failure."""
    try:
        return json.loads(response_text)
    except Exception:
        try:
            return json.loads(_extract_json(response_text))
        except Exception as e:
            print(f"[ollama_client] JSON parse failed: {e}\nRaw: {response_text[:300]}")
            return fallback
