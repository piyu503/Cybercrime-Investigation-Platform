import os
import shutil
from datetime import datetime
from fastapi import UploadFile, HTTPException, status

# ─── Constants ────────────────────────────────────────────────────────────────

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpg",
    "image/jpeg",
    "text/plain",
}

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt"}


def _ensure_upload_dir(case_id: str) -> str:
    """
    Ensure that the upload directory for a given case exists.
    Returns the path to the case-specific folder.
    """
    case_dir = os.path.join(UPLOAD_DIR, case_id)
    os.makedirs(case_dir, exist_ok=True)
    return case_dir


def _validate_file(file: UploadFile, file_bytes: bytes) -> None:
    """
    Validate file type and size.
    Raises HTTPException on failure.
    """
    # Check extension
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"File type '{ext}' is not allowed. "
                f"Accepted types: {', '.join(ALLOWED_EXTENSIONS)}"
            ),
        )

    # Check MIME type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"MIME type '{file.content_type}' is not permitted. "
                f"Accepted MIME types: {', '.join(ALLOWED_CONTENT_TYPES)}"
            ),
        )

    # Check file size
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the 20 MB size limit. Received: {len(file_bytes) / (1024*1024):.2f} MB",
        )


def save_file(file: UploadFile, file_bytes: bytes, case_id: str) -> dict:
    """
    Validate, save a file to disk, and return its metadata dict.
    """
    _validate_file(file, file_bytes)

    case_dir = _ensure_upload_dir(case_id)

    # Build a unique filename to avoid collisions
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    _, ext = os.path.splitext(file.filename)
    safe_original = os.path.splitext(file.filename)[0].replace(" ", "_")
    unique_filename = f"{timestamp}_{safe_original}{ext}"

    file_path = os.path.join(case_dir, unique_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    return {
        "filename": unique_filename,
        "filepath": file_path,
        "filetype": file.content_type,
        "uploaded_at": datetime.utcnow(),
    }
