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

def extract_image(filepath: str) -> dict:
    """
    Extracts text from an image file using Gemini Vision (Primary) with EasyOCR fallback.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    full_text = ""
    error_msg = None

    # Primary: Gemini Vision
    try:
        if not os.environ.get("GEMINI_API_KEY"):
            raise ValueError("GEMINI_API_KEY not set")
            
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Upload using the File API (best for Gemini 2.5 Flash)
        import PIL.Image
        img = PIL.Image.open(filepath)
        response = model.generate_content([img, "Extract all readable text from this image exactly as written. If there is no text, return empty."])
        full_text = response.text.strip()
        
    except Exception as gemini_err:
        print(f"Gemini Vision failed: {gemini_err}. Falling back to EasyOCR.")
        # Fallback: EasyOCR
        try:
            full_text = _run_easyocr_fallback(filepath)
        except Exception as ocr_err:
            error_msg = f"Both Gemini Vision and EasyOCR failed. OCR Err: {str(ocr_err)}"
            raise Exception(error_msg)

    return {
        "text": full_text
    }
