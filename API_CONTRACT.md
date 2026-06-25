# API_CONTRACT.md

Version: 1.0

This document defines the API contract between the FastAPI backend and the React frontend.

The frontend MUST follow this document.

The backend is the source of truth.

---

# BASE URL

Development

http://localhost:8000

---

# CASE MODEL

```json
{
    "_id": "string",
    "case_name": "string",
    "description": "string",
    "created_at": "datetime",
    "files": []
}
```

---

# FILE MODEL

```json
{
    "filename": "string",
    "filepath": "string",
    "filetype": "string",
    "uploaded_at": "datetime"
}
```

---

# GET /cases

Returns

```json
[
    {
        "_id": "...",
        "case_name": "...",
        "description": "...",
        "created_at": "...",
        "files": []
    }
]
```

Frontend

Dashboard

Cases Page

Recent Cases

Search

---

# POST /cases

Request

```json
{
    "case_name":"Cyber Fraud",
    "description":"Investigation of phishing case."
}
```

Response

(Replace this with your actual Swagger response.)

---

# GET /cases/{case_id}

Returns

```json
{
    "_id":"...",
    "case_name":"...",
    "description":"...",
    "created_at":"...",
    "files":[]
}
```

---

# POST /upload/{case_id}

Request

multipart/form-data

file

Response

(Replace with actual Swagger response.)

---

# SUPPORTED FILE TYPES

PDF

PNG

JPG

JPEG

TXT

Maximum

20 MB

---

# FUTURE ENDPOINTS

POST /process/{case_id}

Runs complete AI pipeline.

---

GET /entities/{case_id}

Returns extracted entities.

---

GET /timeline/{case_id}

Returns investigation timeline.

---

GET /intelligence/{case_id}

Returns

Contradictions

Investigation Gaps

Recommendations

Readiness Score

---

GET /report/{case_id}

Returns investigation report.

---

# IMPORTANT RULES

Frontend must NEVER use

title

status

caseId

case_id

content_type

createdAt

url

unless backend explicitly changes.

Always inspect backend responses before generating frontend code.