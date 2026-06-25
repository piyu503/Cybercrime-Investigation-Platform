ENTITY_EXTRACTION_PROMPT = """
You are an expert Intelligence Analyst extracting structured entities from digital evidence.
Read the following extracted text and identify all instances of the following entities:
- persons
- phones
- vehicles
- locations
- dates
- times
- organizations
- emails
- money
- evidence_ids

Rules:
1. Only extract entities explicitly mentioned in the text.
2. If an entity type is not found, return an empty list for that key.
3. Provide a single "confidence" dictionary that maps every extracted entity value (as a string key) to a float confidence score between 0.0 and 1.0.
4. Return your response strictly as valid JSON matching the format below. Do not use markdown blocks outside the JSON.

Output format:
{
  "persons": ["John Doe"],
  "phones": ["+91-9876543210"],
  "vehicles": [],
  "locations": [],
  "dates": [],
  "times": [],
  "organizations": [],
  "emails": [],
  "money": [],
  "evidence_ids": [],
  "confidence": {
    "John Doe": 0.95,
    "+91-9876543210": 0.9
  }
}

Extracted Text:
\"\"\"
{text}
\"\"\"
"""
