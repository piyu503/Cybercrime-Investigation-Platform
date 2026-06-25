import os
import mimetypes
from datetime import datetime

def extract_metadata(filepath: str) -> dict:
    """
    Extracts explicit file metadata including stats.
    Returns: filename, extension, mime_type, size_bytes, created_time, modified_time
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    stat = os.stat(filepath)
    filename = os.path.basename(filepath)
    extension = os.path.splitext(filename)[1].lower()
    
    # Guess mime type
    mime_type, _ = mimetypes.guess_type(filepath)
    if not mime_type:
        mime_type = "application/octet-stream"

    created_time = datetime.fromtimestamp(stat.st_ctime).isoformat()
    modified_time = datetime.fromtimestamp(stat.st_mtime).isoformat()

    return {
        "filename": filename,
        "extension": extension,
        "mime_type": mime_type,
        "size_bytes": stat.st_size,
        "created_time": created_time,
        "modified_time": modified_time
    }
