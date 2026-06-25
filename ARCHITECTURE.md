# Investigation Forensix

**Version:** 1.0

**Hackathon:** Police Hackathon 2026

**Challenge:**
Digital Evidence & Investigation Automation

---

# Vision

Investigation Forensix is an AI-powered Digital Investigation Copilot designed for law enforcement agencies.

Instead of manually reading FIRs, WhatsApp chats, witness statements, images, videos and other digital evidence, the platform automatically analyzes evidence, extracts intelligence, identifies investigation gaps, and generates court-ready investigation reports.

The objective is to reduce investigation time while improving evidence consistency and case readiness.

---

# Final User Workflow

Officer Login
↓

Create Investigation Case
↓

Upload Digital Evidence

(FIR, Chats, Images, Audio, Video, Documents)

↓

Evidence Processing

↓

OCR + Text Extraction

↓

Evidence Classification

↓

Entity Extraction

↓

Timeline Generation

↓

Evidence Correlation

↓

Investigation Gap Detection

↓

Readiness Score

↓

Court Ready Investigation Report

---

# Tech Stack

## Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Axios
- Lucide Icons

---

## Backend

- FastAPI
- Uvicorn
- Motor
- MongoDB Atlas
- Pydantic

---

## AI

- Gemini 2.5 Flash
- Gemini 2.5 Pro

---

## OCR

- EasyOCR
- PyMuPDF
- Pillow

---

## Report Generation

- ReportLab

---

# Folder Structure

Frontend

frontend/

src/

api/

hooks/

types/

constants/

components/

dashboard/

cases/

upload/

layout/

ui/

layouts/

pages/

routes/

lib/

App.tsx

main.tsx

---

Backend

backend/

routes/

cases.py

upload.py

services/

database/

models/

uploads/

app.py

---

# Backend API

## Cases

GET /cases

Returns all cases

POST /cases

Creates new case

GET /cases/{case_id}

Returns one case

---

## Upload

POST /upload/{case_id}

Uploads evidence

---

# Backend Models

## Case

```ts
{
    "_id": string,
    "case_name": string,
    "description": string,
    "created_at": string,
    "files": FileMetadata[]
}
```

---

## FileMetadata

```ts
{
    "filename": string,
    "filepath": string,
    "filetype": string,
    "uploaded_at": string
}
```

---

# Backend Contract

The backend is the single source of truth.

Frontend must NEVER invent new fields.

Always use

```
_id

case_name

description

created_at

files

filename

filepath

filetype

uploaded_at
```

Never replace them with

```
title

status

caseId

case_id

url

content_type

createdAt
```

unless the backend itself changes.

---

# Current Project Status

## Completed

✅ Backend Foundation

✅ MongoDB Integration

✅ Case CRUD

✅ Evidence Upload

✅ Dashboard

✅ Case Management

✅ Upload Module

---

## In Progress

Frontend stabilization

TypeScript cleanup

Route validation

API integration

---

## Remaining Modules

### Day 2

Evidence Agent

- PDF Parsing
- OCR
- Metadata Extraction
- Evidence Classification

---

### Day 3

Entity Agent

Extract

- Person
- Phone
- Vehicle
- Email
- Date
- Time
- Address
- Organization

---

### Day 4

Timeline Agent

Generate chronological timeline using extracted evidence.

---

### Day 5

Intelligence Agent

Generate

- Contradictions
- Investigation Gaps
- Recommended Actions
- Readiness Score

---

### Day 6

Report Agent

Generate

- Investigation Summary
- Timeline
- Evidence Inventory
- Missing Evidence
- Recommendations

Export PDF.

---

# Coding Rules

Always reuse existing hooks.

Never duplicate interfaces.

Never call axios directly from pages.

Always use the API layer.

Always import shared types.

Never duplicate API logic.

Do not redesign architecture.

Do not rename folders.

Do not change backend contracts.

Do not invent response fields.

---

# Development Workflow

Before modifying code

1.

Read backend

2.

Understand API contract

3.

Understand frontend architecture

4.

Identify affected files

5.

Modify only those files

---

After every change

Project must pass

```
npm install

npm run dev

npx tsc --noEmit
```

without

- TypeScript errors

- Import errors

- Build errors

---

# UI Philosophy

This is NOT a SaaS dashboard.

This is NOT an AI chatbot.

This is NOT a startup admin panel.

The UI should resemble professional investigation software such as

- Palantir Gotham
- Cellebrite
- IBM i2
- Magnet AXIOM

Design Principles

- Dense but readable
- Professional
- Information-first
- Minimal animations
- Dark navigation
- Light or dark workspace depending on readability
- Functional over decorative

---

# AI Principles

Every AI module must produce structured JSON.

Never rely on free-form responses.

All AI outputs must be parsable.

Every AI response should include

- confidence
- reasoning (where applicable)
- structured fields

---

# Success Criteria

By demo day the complete workflow must be

Officer uploads evidence

↓

System automatically processes evidence

↓

AI extracts entities

↓

AI generates timeline

↓

AI identifies contradictions

↓

AI recommends investigation steps

↓

AI generates court-ready report

The experience should require minimal manual intervention from the investigating officer.

---

# Instructions for AI Assistant

Before generating any code:

- Read this document completely.
- Analyze the existing codebase.
- Respect the backend contract.
- Do not redesign the project.
- Modify only the required files.
- Preserve consistency across the entire repository.

If there is any ambiguity, inspect the existing code instead of inventing new structures.