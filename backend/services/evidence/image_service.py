import os
import easyocr
import google.generativeai as genai

# Lazy initialize the reader to prevent multiprocessing issues with uvicorn --reload on Windows
_reader = None

def get_reader():
    global _reader
    if _reader is None:
        try:
            _reader = easyocr.Reader(['en'])
        except Exception as e:
            print(f"Failed to initialize EasyOCR: {e}")
            raise e
    return _reader

def _run_easyocr_fallback(filepath: str) -> str:
    reader = get_reader()
    result = reader.readtext(filepath)
    text_lines = [item[1] for item in result]
    return "\n".join(text_lines).strip()

def extract_exif_data(filepath: str) -> dict:
    """Extracts EXIF metadata from an image file."""
    exif_data = {}
    try:
        from PIL import Image
        from PIL.ExifTags import TAGS, GPSTAGS
        with Image.open(filepath) as img:
            raw_exif = img._getexif()
            if raw_exif:
                for tag_id, value in raw_exif.items():
                    tag_name = TAGS.get(tag_id, tag_id)
                    
                    if isinstance(value, bytes):
                        try:
                            value = value.decode('utf-8')
                        except UnicodeDecodeError:
                            value = str(value)
                            
                    if tag_name == "GPSInfo":
                        gps_data = {}
                        for t in value:
                            gps_tag = GPSTAGS.get(t, t)
                            gps_data[gps_tag] = str(value[t])
                        exif_data["GPS"] = gps_data
                    else:
                        exif_data[tag_name] = value
    except Exception as e:
        print(f"EXIF extraction failed or not present: {e}")
        
    forensic_exif = {}
    if "DateTimeOriginal" in exif_data:
        forensic_exif["DateTimeOriginal"] = str(exif_data["DateTimeOriginal"])
    if "Make" in exif_data:
        forensic_exif["CameraMake"] = str(exif_data["Make"])
    if "Model" in exif_data:
        forensic_exif["CameraModel"] = str(exif_data["Model"])
    if "GPS" in exif_data:
        forensic_exif["GPSData"] = str(exif_data["GPS"])
        
    return forensic_exif

def extract_image(filepath: str) -> dict:
    """
    Extracts text from an image file using local EasyOCR.
    Also extracts EXIF metadata.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    full_text = ""
    
    exif = extract_exif_data(filepath)

    try:
        full_text = _run_easyocr_fallback(filepath)
    except Exception as ocr_err:
        print(f"EasyOCR failed: {ocr_err}")

    return {
        "text": full_text,
        "metadata": {
            "exif": exif
        }
    }
