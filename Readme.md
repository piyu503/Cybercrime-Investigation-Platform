# 🛡️ Investigation Forensix

> **AI-Powered Digital Evidence & Investigation Automation Platform**
>
> Built for **Police Hackathon 2026** | Challenge 11 – Digital Evidence & Investigation Automation

---

## 📌 Overview

Investigation Forensix is an AI-assisted investigation platform that helps law enforcement agencies process digital evidence faster, identify critical intelligence, and generate court-ready investigation reports.

Instead of manually reviewing FIRs, witness statements, WhatsApp chats, images, and other digital evidence, the system automatically:

- 📄 Extracts text from uploaded evidence
- 🏷️ Classifies evidence
- 👥 Identifies entities (people, phones, locations, vehicles, etc.)
- 📅 Generates a chronological investigation timeline
- ⚠️ Detects contradictions and investigation gaps
- 📊 Calculates investigation readiness
- 📑 Produces a court-ready investigation report

---

# 🚨 Problem Statement

Modern investigations involve enormous volumes of digital evidence.

Investigators often spend significant time:

- Reading FIRs
- Reviewing witness statements
- Analyzing chat exports
- Organizing evidence manually
- Creating investigation summaries

This process is time-consuming, error-prone, and difficult to scale.

---

# 💡 Our Solution

Investigation Forensix acts as an AI Investigation Copilot.

It automatically processes uploaded evidence and converts unstructured information into actionable intelligence.

---

# 🔄 End-to-End Workflow

```text
Create Investigation
        │
        ▼
Upload Evidence
(FIR, Chat, Images, Documents)
        │
        ▼
Evidence Processing
        │
        ▼
OCR & Text Extraction
        │
        ▼
Evidence Classification
        │
        ▼
Entity Extraction
        │
        ▼
Timeline Generation
        │
        ▼
Intelligence Analysis
        │
        ▼
Readiness Score
        │
        ▼
Court Ready Report
```

---

# ✨ Features

## ✅ Investigation Case Management

- Create Investigation Cases
- Case Dashboard
- Evidence Inventory
- Investigation Tracking

---

## 📂 Digital Evidence Upload

Supports:

- PDF
- PNG
- JPG
- JPEG
- TXT

Drag & Drop Upload

Upload Progress

File Validation

---

## 🤖 AI Evidence Processing *(Day 2)*

- PDF Parsing
- OCR
- Metadata Extraction
- Automatic Evidence Classification

---

## 🧠 Entity Extraction *(Day 3)*

Extracts:

- Persons
- Phone Numbers
- Vehicle Numbers
- Addresses
- Organizations
- Dates
- Times
- Emails

---

## 🕒 Timeline Generation *(Day 4)*

Automatically creates chronological timelines from all evidence.

Example:

```text
7:15 PM
Rahul called Aman

↓

7:42 PM
Vehicle UP65AB1234 entered location

↓

8:03 PM
Witness reached crime scene
```

---

## 🔍 Investigation Intelligence *(Day 5)*

Automatically identifies:

- Contradictions
- Missing Evidence
- Investigation Gaps
- Recommended Actions
- Readiness Score

---

## 📄 AI Report Generation *(Day 6)*

Generates:

- Investigation Summary
- Timeline
- Evidence Inventory
- Key Findings
- Investigation Gaps
- Recommendations
- Court-ready PDF Report

---

# 🏗️ System Architecture

```text
                React + Vite Frontend
                        │
                        ▼
                FastAPI Backend
                        │
                        ▼
                 AI Orchestrator
                        │
 ┌─────────────────────────────────────────┐
 │                                         │
 │   Evidence Agent                        │
 │   Entity Agent                          │
 │   Timeline Agent                        │
 │   Intelligence Agent                    │
 │   Report Agent                          │
 │                                         │
 └─────────────────────────────────────────┘
                        │
                        ▼
                  MongoDB Atlas
```

---

# 🛠️ Tech Stack

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
- MongoDB Atlas
- Motor
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

# 📁 Project Structure

```text
Forensix/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── database/
│   └── app.py
│
├── ARCHITECTURE.md
├── ROADMAP.md
├── API_CONTRACT.md
├── AI_CONTEXT.md
└── README.md
```

---

# 🚀 Installation

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📌 Development Status

| Module | Status |
|---------|--------|
| Backend Foundation | ✅ |
| Frontend Foundation | ✅ |
| Dashboard | ✅ |
| Case Management | ✅ |
| Evidence Upload | ✅ |
| Evidence Processing | 🚧 |
| Entity Extraction | 🚧 |
| Timeline Generation | 🚧 |
| Intelligence Engine | 🚧 |
| Report Generator | 🚧 |

---

# 🎯 Hackathon Deliverables

By demo day the platform will demonstrate:

- ✅ Create Investigation Case
- ✅ Upload Evidence
- ✅ Automatic OCR
- ✅ Evidence Classification
- ✅ Entity Extraction
- ✅ Timeline Generation
- ✅ Investigation Gap Detection
- ✅ Readiness Score
- ✅ Court-ready Investigation Report

---

# 👥 Team

> Add your team members here.

Example:

- Piyush Jaiswal
- Member 2
- Member 3

---

# 📜 License

This project was developed for **Police Hackathon 2026**.

---

# 🌟 Vision

Investigation Forensix aims to become an AI-powered investigation assistant that enables law enforcement agencies to process digital evidence faster, reduce manual effort, and improve investigation quality through intelligent automation.   