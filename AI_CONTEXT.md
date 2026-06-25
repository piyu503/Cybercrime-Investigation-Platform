# AI_CONTEXT.md

# Investigation Forensix — AI Development Context

Version: 1.0

This document defines how any AI coding assistant (Gemini, Claude, ChatGPT, etc.) should interact with this repository.

It is NOT a feature specification.

It is the engineering guide that must be followed before generating any code.

---

# PRIMARY OBJECTIVE

Build a production-quality prototype for the Police Hackathon.

The objective is NOT to generate maximum code.

The objective is to build a stable, maintainable and demonstrable AI-powered Digital Investigation Platform.

Always prioritize:

Consistency

↓

Correctness

↓

Maintainability

↓

Features

Never sacrifice architecture for speed.

---

# PROJECT OVERVIEW

Investigation Forensix is an AI-assisted Digital Evidence & Investigation Automation platform.

Target users:

Police Officers

Investigators

Cyber Crime Units

Digital Forensic Analysts

The system assists investigators by automatically processing evidence and generating investigation intelligence.

---

# DEVELOPMENT PRINCIPLE

Before writing ANY code:

Read

ARCHITECTURE.md

↓

Read

ROADMAP.md

↓

Analyze Backend

↓

Analyze Frontend

↓

Identify affected modules

↓

Modify ONLY those modules

Never generate code blindly.

---

# SOURCE OF TRUTH

The backend is the source of truth.

Never invent frontend fields.

Never rename backend properties.

If frontend and backend disagree,

update frontend

NOT backend.

---

# DO NOT INVENT SCHEMA

If backend returns

{
    "_id":"",
    "case_name":"",
    "description":"",
    "created_at":"",
    "files":[]
}

Frontend MUST use

_id

case_name

description

created_at

files

Never rename them into

title

caseId

case_id

status

createdAt

or any alternative.

Inspect existing backend models before coding.

---

# ALWAYS ANALYZE FIRST

Before modifying code:

Understand

Folder structure

↓

Existing components

↓

Existing hooks

↓

Existing API layer

↓

Existing Types

↓

React Router

↓

Backend routes

↓

Mongo models

Only then generate code.

---

# DO NOT DUPLICATE

Never duplicate

Types

Interfaces

API functions

Hooks

Utility functions

Constants

If something already exists,

reuse it.

---

# FRONTEND RULES

Framework

React + Vite + TypeScript

Always use

React Router

TanStack Query

Axios API layer

Tailwind

shadcn/ui

Never fetch data directly from components.

Pages must use hooks.

Hooks use API layer.

API layer communicates with backend.

---

Correct flow

Page

↓

Hook

↓

API

↓

Backend

Never

Page

↓

Axios

↓

Backend

---

# BACKEND RULES

Framework

FastAPI

Never place business logic inside routes.

Routes

↓

Services

↓

Database

AI Processing

↓

Services

Never place AI prompts inside routes.

---

# AI MODULES

Each AI module lives independently.

Evidence Agent

Entity Agent

Timeline Agent

Intelligence Agent

Report Agent

Never combine all AI logic into one file.

---

# FOLDER STRUCTURE

Frontend

frontend/

src/

api/

hooks/

types/

constants/

components/

layouts/

pages/

routes/

lib/

Backend

backend/

routes/

services/

database/

models/

prompts/

orchestrator/

uploads/

---

# FILE MODIFICATION RULE

Modify existing files whenever possible.

Only create new files when genuinely required.

Do NOT regenerate the entire project.

---

# IMPORT RULES

Always reuse aliases.

Use

@/

instead of long relative imports when configured.

Never create duplicate imports.

Never leave unused imports.

---

# TYPESCRIPT RULES

Every generated code must pass

npx tsc --noEmit

No

any

unless absolutely unavoidable.

No duplicate interfaces.

Use shared types.

---

# REACT QUERY RULES

Always use

useQuery

useMutation

Never call axios directly inside components.

Never duplicate fetching logic.

Always invalidate queries after mutation.

---

# API RULES

Use

src/api

for all backend communication.

Do NOT create API calls inside pages.

Do NOT create API calls inside components.

---

# UI PRINCIPLES

This is NOT

A startup dashboard

A SaaS admin panel

A CRM

The interface should resemble

Palantir Gotham

IBM i2

Cellebrite

Magnet AXIOM

Information density

Professional appearance

Minimal animations

Functional UI

Evidence-focused

Dark investigation theme

Avoid excessive gradients

Avoid neon colors

Avoid glassmorphism

Avoid oversized cards

---

# BEFORE GENERATING NEW CODE

Always ask internally

Does this already exist?

Can this be reused?

Will this break backend compatibility?

Will this duplicate functionality?

Can this be implemented by extending existing code?

If yes,

reuse.

---

# BEFORE MODIFYING FILES

List

Files to modify

Reason

Expected impact

Only then begin editing.

Never edit unrelated files.

---

# OUTPUT FORMAT

When generating code:

First explain

What files will change

Why

Then generate code.

Do NOT regenerate unaffected files.

---

# ERROR FIXING

When fixing bugs

Never guess.

Inspect

Types

Hooks

API responses

Backend routes

Only after understanding the issue,

generate the fix.

---

# BUILD REQUIREMENTS

Every change must satisfy

npm install

npm run dev

npx tsc --noEmit

No

TypeScript errors

Import errors

Build errors

Broken routes

---

# GIT WORKFLOW

Each completed module should be independently committable.

Recommended commits

Day 1

Frontend Foundation

Day 2

Evidence Agent

Day 3

Entity Agent

Day 4

Timeline Agent

Day 5

Intelligence Agent

Day 6

Report Agent

Day 7

UI Polish

Day 8

Demo Ready

---

# HACKATHON OBJECTIVE

The judges should be able to

Create Case

↓

Upload Evidence

↓

Watch AI process evidence

↓

View extracted entities

↓

View investigation timeline

↓

Identify contradictions

↓

View readiness score

↓

Download investigation report

without manual intervention.

Everything generated by the AI assistant must contribute toward that workflow.

---

# FINAL RULE

Do not optimize for generating more code.

Optimize for producing a stable, consistent, extensible codebase that can be demonstrated confidently during the hackathon.

Whenever uncertain, analyze the existing project before making changes.