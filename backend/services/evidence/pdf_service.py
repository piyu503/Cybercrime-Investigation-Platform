import fitz  # PyMuPDF
import os

def extract_pdf(filepath: str) -> dict:
    """
    Extracts text and metadata from a PDF file.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    text_content = []
    metadata = {"size_bytes": os.path.getsize(filepath)}

    try:
        # Open the PDF file
        doc = fitz.open(filepath)
        
        # Extract metadata
        pdf_meta = doc.metadata
        if pdf_meta:
            metadata["author"] = pdf_meta.get("author", "")
            metadata["creator"] = pdf_meta.get("creator", "")
            metadata["creationDate"] = pdf_meta.get("creationDate", "")
            metadata["title"] = pdf_meta.get("title", "")
            
        metadata["page_count"] = doc.page_count
        
        # Extract text from each page
        for page_num in range(len(doc)):
            page = doc[page_num]
            text_content.append(page.get_text())
            
        doc.close()
        
    except Exception as e:
        raise Exception(f"Failed to parse PDF: {str(e)}")

    full_text = "\n".join(text_content).strip()
    
    return {
        "text": full_text,
        "metadata": metadata
    }
