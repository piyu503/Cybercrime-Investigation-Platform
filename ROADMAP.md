# Investigation Forensix Roadmap

Version: 1.0

Project Duration: 8 Days

Status: Active Development

---

# Objective

Build an AI-powered Digital Evidence & Investigation Automation platform capable of assisting police officers throughout the investigation lifecycle.

The system should automatically process uploaded evidence, extract intelligence, identify investigation gaps, and generate court-ready reports.

---

# Development Progress

## Phase 0 — Project Foundation ✅

Status: Completed

### Backend

- FastAPI project initialized
- MongoDB Atlas connected
- Case CRUD implemented
- File upload endpoint implemented
- Swagger documentation available
- Project structure finalized

### Frontend

- React + Vite initialized
- Tailwind configured
- shadcn/ui integrated
- Dashboard created
- Case Management pages created
- Upload module created
- Routing implemented
- React Query integrated
- API layer created

Remaining

- TypeScript cleanup
- Navigation validation
- API contract verification

---

# Phase 1 — Ingestion Pipeline

Status: Not Started

Goal

Automatically process uploaded evidence.

Tasks

- PDF Parser
- OCR
- Metadata Extraction
- Evidence Classification

Expected Output

```json
{
    "type":"FIR",
    "confidence":0.97,
    "text":"...",
    "metadata":{}
}
```

Deliverables

Evidence Agent

---

# Phase 2 — Entity Extraction

Status: Not Started

Goal

Extract structured entities from evidence.

Entities

- Person
- Phone Number
- Vehicle Number
- Address
- Date
- Time
- Organization
- Email

Expected Output

```json
{
  "persons":[],
  "phones":[],
  "vehicles":[],
  "locations":[]
}
```

Deliverables

Entity Agent

---

# Phase 3 — Timeline Generation

Status: Not Started

Goal

Generate chronological investigation timeline.

Example

7:10 PM

↓

Rahul calls Aman

↓

7:45 PM

↓

Vehicle arrives

↓

8:05 PM

↓

Witness reaches location

Deliverables

Timeline Agent

---

# Phase 4 — Intelligence Engine

Status: Not Started

Goal

Analyze evidence consistency.

Features

- Contradiction Detection
- Missing Evidence Detection
- Investigation Gap Analysis
- Recommendation Engine
- Readiness Score

Expected Output

```json
{
  "contradictions":[],
  "gaps":[],
  "recommendations":[],
  "readiness_score":82
}
```

Deliverables

Intelligence Agent

---

# Phase 5 — Report Generation

Status: Not Started

Goal

Generate court-ready report.

Sections

- Investigation Summary
- Timeline
- Evidence Inventory
- Key Findings
- Investigation Gaps
- Recommendations
- Readiness Score

Deliverables

Report Agent

---

# Phase 6 — UI Polish

Status: Pending

Tasks

- Professional animations
- Better empty states
- Timeline visualization
- Entity cards
- Evidence gallery
- Improved loading indicators
- Responsive layout

---

# Phase 7 — Demo Preparation

Status: Pending

Tasks

- Demo dataset
- Demo script
- PPT
- Backup screenshots
- Demo video
- Judge Q&A preparation

---

# Current Backend

Status

Stable

Needs

Evidence Processing

Entity Extraction

Timeline APIs

Report APIs

---

# Current Frontend

Status

Mostly Complete

Needs

Navigation cleanup

TypeScript cleanup

Backend integration verification

Evidence visualization

Timeline visualization

Report UI

---

# Priority Order

Priority 1

Stabilize Project

Priority 2

Evidence Agent

Priority 3

Entity Agent

Priority 4

Timeline Agent

Priority 5

Intelligence Agent

Priority 6

Report Generation

Priority 7

UI Polish

Priority 8

Hackathon Demo

---

# Rules

Never redesign architecture.

Never rename backend models.

Never duplicate types.

Never bypass API layer.

Always analyze existing code before generating new code.

Every new feature must compile successfully before moving to the next module.

---

# Definition of Done

The project is considered complete when an investigating officer can:

Create a Case

↓

Upload Evidence

↓

Automatically Process Evidence

↓

Extract Entities

↓

Generate Timeline

↓

Detect Investigation Gaps

↓

Calculate Readiness Score

↓

Download Court-ready Investigation Report

with minimal manual intervention.