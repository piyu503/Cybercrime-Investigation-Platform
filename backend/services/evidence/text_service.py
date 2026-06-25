import os

def extract_text(filepath: str) -> dict:
    """
    Reads a raw text file and returns the content.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()

    return {
        "text": text,
        "metadata": {
            "size_bytes": os.path.getsize(filepath)
        }
    }
