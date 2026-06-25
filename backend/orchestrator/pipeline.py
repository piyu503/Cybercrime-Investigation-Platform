import os
from bson import ObjectId
from database.mongodb import get_database

from services.evidence.pdf_service import extract_pdf
from services.evidence.image_service import extract_image
from services.evidence.text_service import extract_text
from services.evidence.metadata_service import extract_metadata
from services.evidence.classification_service import classify_evidence
from services.evidence.entity_service import extract_entities

async def start_pipeline(case_id: str) -> dict:
    """
    Evidence Processing Pipeline.
    Fetches unprocessed files, extracts text based on type, classifies, and extracts entities.
    """
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        return {"status": "failed", "processed_files": 0, "failed_files": 0, "results": []}

    files = case.get("files", [])
    processed_count = 0
    failed_count = 0
    results = []

    for i, file_obj in enumerate(files):
        if file_obj.get("is_processed", False):
            continue

        filepath = file_obj.get("filepath")
        filetype = file_obj.get("filetype", "")
        
        try:
            # 1. Extract unified file metadata
            file_meta = extract_metadata(filepath)
            
            # 2. Extract text and type-specific metadata
            extracted_data = {"text": "", "metadata": {}}
            if "pdf" in filetype.lower() or filepath.lower().endswith(".pdf"):
                extracted_data = extract_pdf(filepath)
            elif "image" in filetype.lower() or filepath.lower().endswith((".png", ".jpg", ".jpeg")):
                extracted_data = extract_image(filepath)
            elif "text" in filetype.lower() or filepath.lower().endswith(".txt"):
                extracted_data = extract_text(filepath)
            else:
                failed_count += 1
                continue
                
            raw_text = extracted_data.get("text", "")
            
            # Merge general metadata with type-specific metadata
            combined_metadata = {**file_meta, **extracted_data.get("metadata", {})}
            
            # 3. AI Agents
            classification_result = classify_evidence(raw_text)
            entities_result = extract_entities(raw_text)
                
            # 4. Save to MongoDB
            processed_data = {
                "extracted_text": raw_text,
                "metadata": combined_metadata,
                "classification": classification_result.get("classification", "Unknown"),
                "entities": entities_result
            }
            
            await db["cases"].update_one(
                {"_id": ObjectId(case_id)},
                {"$set": {
                    f"files.{i}.is_processed": True,
                    f"files.{i}.processed_data": processed_data
                }}
            )
            processed_count += 1
            results.append({
                "filename": file_obj.get("filename"),
                "classification": processed_data["classification"],
                "status": "success"
            })
            
        except Exception as e:
            print(f"Failed to process file {filepath}: {e}")
            failed_count += 1
            results.append({
                "filename": file_obj.get("filename"),
                "error": str(e),
                "status": "failed"
            })

    return {
        "status": "completed",
        "processed_files": processed_count,
        "failed_files": failed_count,
        "results": results
    }
