# 🛡️ Forensix: AI-Powered Cybercrime Investigation Platform

> **Police Hackathon 2026**
> **Challenge 11 – Digital Evidence & Investigation Automation**

Forensix is an AI-assisted digital investigation platform that transforms raw evidence into structured intelligence. Instead of manually reviewing hundreds of documents, investigators can upload digital evidence and receive automatically generated timelines, entity relationships, knowledge graphs, contradictions, investigation gaps, readiness scores, and court-ready investigation reports.

---

# Why Forensix?

Modern cybercrime investigations often involve:

* WhatsApp chat exports
* Bank statements
* FIRs
* Witness statements
* Emails
* Images
* Device metadata
* Call logs

Investigators typically spend days connecting these pieces manually.

Forensix automates this process using a deterministic multi-agent pipeline backed by AI-assisted reasoning.

---

# Features

## Evidence Processing

* PDF parsing
* OCR for scanned documents
* TXT / CSV ingestion
* Image text extraction
* Metadata extraction
* Automatic evidence categorization

---

## AI Investigation Pipeline

* Evidence Classification
* Entity Extraction
* Timeline Generation
* Knowledge Graph Construction
* Correlation Engine
* Contradiction Detection
* Missing Evidence Detection
* Readiness Scoring
* AI Investigation Copilot
* Court-Ready Report Generation

---

## Investigation Dashboard

* Case Management
* Evidence Locker
* Interactive Timeline
* Knowledge Graph
* AI Copilot
* Investigation Reports
* Activity Stream
* Audit Logs

---

# Supported Evidence Types

* PDF
* TXT
* CSV
* PNG
* JPG
* JPEG

Typical investigation files include:

* FIR Reports
* Bank Statements
* WhatsApp Exports
* Email Dumps
* Witness Statements
* Device Metadata
* Call Logs
* Financial Records

---

# Investigation Pipeline

```text
Evidence Upload
        │
        ▼
OCR / Text Extraction
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
Knowledge Graph
        │
        ▼
Correlation Engine
        │
        ▼
Contradiction Detection
        │
        ▼
Gap Analysis
        │
        ▼
Readiness Score
        │
        ▼
AI Investigation Report
```

Unlike a simple LLM chatbot, Forensix combines deterministic engines with AI reasoning to keep findings grounded in uploaded evidence.

---

# Tech Stack

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Framer Motion

---

## Backend

* FastAPI
* Python
* MongoDB
* ReportLab

---

## AI

* Google Gemini (Flash / Pro)
* EasyOCR
* PyMuPDF
* Pillow

---

# Project Structure

```text
Forensix/

backend/
    agents/
    engines/
    routes/
    services/
    models/
    prompts/
    database/

frontend/
    components/
    pages/
    hooks/
    services/
    lib/

uploads/
```

---

# Getting Started

## Prerequisites

* Python 3.11+
* Node.js 20+
* MongoDB Community Server
* npm

---

## Clone Repository

```bash
git clone <repository-url>
cd Forensix
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=forensix_db

GEMINI_API_KEY=YOUR_API_KEY
```

Start backend

```bash
uvicorn app:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open

```
http://localhost:5173
```

---

# Running an Investigation

1. Create a Case
2. Upload evidence
3. Click **Run AI Engine**
4. Wait for processing
5. Explore:

* Overview
* Evidence
* Timeline
* Knowledge Graph
* Copilot
* Reports

---

# Sample Test Cases

The repository includes sample investigation datasets.

Examples include:

* Financial Fraud
* Phishing
* Bank Transfer Fraud

Upload every file from a dataset into a single case and run the AI Engine.

---

# Screenshots

Add screenshots or GIFs here:

* Dashboard
* Knowledge Graph
* Timeline
* Copilot
* Investigation Report

---

# Troubleshooting

## MongoDB Connection Error

Verify MongoDB is running:

```bash
mongod
```

or connect using

```
mongodb://localhost:27017
```

---

## Backend Not Starting

Ensure:

* Python virtual environment is activated
* Dependencies installed
* `.env` configured

---

## AI Not Responding

Verify:

* Gemini API Key or LLM Local Model key
* Internet connectivity
* Backend logs

---

# Future Improvements

* Video Evidence Analysis
* Audio Transcription
* Face Recognition
* Device Forensics
* Cellebrite / UFDR Import
* Multi-user Collaboration
* Role-Based Access Control
* Chain of Custody Tracking

---

# Team

* Piyush Jaiswal
* Add remaining team members

---

# License

Developed for **Police Hackathon 2026**.

This project demonstrates how AI-assisted investigation can help law enforcement process digital evidence faster while keeping every finding grounded in uploaded evidence.
