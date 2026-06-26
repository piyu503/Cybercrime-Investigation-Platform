# 🛡️ Forensix: The AI Cybercrime Investigator

> **Built for Police Hackathon 2026** | Challenge 11 – Digital Evidence & Investigation Automation

Imagine you're a detective. You just received a hard drive with 50 bank statements, 20 WhatsApp chat exports, hundreds of emails, and a handful of witness statements. You know there is a crime hidden in there—money laundering, fraud, or maybe worse—but you have to read *every single page* to find the connections. 

You have to manually draw the timeline. You have to manually figure out that a phone number in a WhatsApp chat on Tuesday belongs to the same person who received a suspicious bank transfer on Thursday. It takes weeks. It's exhausting, error-prone, and criminals get away because investigators are drowning in raw data.

**That's exactly why we built Forensix.**

Forensix isn't just a document reader. It's an AI-assisted digital investigation platform that transforms raw evidence into structured intelligence. Instead of manually reviewing hundreds of documents, investigators can upload digital evidence and receive automatically generated timelines, entity relationships, knowledge graphs, contradictions, investigation gaps, readiness scores, and court-ready investigation reports.

---

## 💡 How It Actually Works (The "Brain" of Forensix)

Unlike a simple LLM chatbot, Forensix combines deterministic engines with AI reasoning to keep findings grounded in uploaded evidence. We didn't just plug a massive dataset into an LLM and ask it to "summarize." That leads to hallucinations, which are unacceptable in a court of law. Instead, we built a **deterministic, multi-agent pipeline**. 

Here is exactly what happens when you hit "Upload":

1. **Extraction (The Eyes):** We use EasyOCR and PyMuPDF to extract raw text from your PDFs, TXT files, CSVs, and even images. Whether it's a blurry FIR or a pristine bank statement, the system extracts the metadata and categorizes the evidence.
2. **Entity Extraction (The Memory):** We feed the raw text to an AI agent that extracts the *Who, What, Where, and When*. It pulls out names, phone numbers, crypto wallets, and vehicle plates.
3. **The Knowledge Graph (The Detective Board):** This is the magic. Forensix builds a massive relational database. If "Arthur" is mentioned in an email dump, and "Arthur" is also mentioned in a financial record, Forensix draws a string between them on a digital corkboard.
4. **Timeline Generation (The Story):** The system automatically reconstructs the sequence of events chronologically, linking every event directly back to the source file (e.g., call logs, witness statements) that proves it happened.
5. **Intelligence Engines (The Senior Investigator):** Once the graph and timeline are built, our deterministic engines scan the data to find:
   - **Contradictions:** (e.g., "The suspect said they didn't know the victim, but they texted them yesterday.")
   - **Gaps:** (e.g., "We have the bank transfer, but we are missing the authorization signature.")
   - **Strategic Assessment:** (e.g., "Next step: Subpoena the offshore account ending in 7712.")
6. **Readiness Scoring & Court Reports:** Finally, the system calculates a Readiness Score and compiles all of this into a **Court-Ready PDF**, complete with confidence scores and exact evidence snippets.

---

## 📂 Supported Evidence Types

Forensix natively understands the chaos of a real investigation. You can upload:
- **PDF, TXT, CSV, PNG, JPG, JPEG**

Typical investigation files you should throw at it include:
- FIR Reports & Witness Statements
- Bank Statements & Financial Records
- WhatsApp Exports & Email Dumps
- Device Metadata & Call Logs

---

## 🔒 Two AI Modes: Because Security Matters

We know that law enforcement agencies have strict data privacy laws. That's why Forensix is built with a flexible AI architecture.

### Option 1: Local AI (Recommended for High Security)
Keep everything completely offline and on your own hardware. Zero data leaves your machine. Perfect for classified or sensitive investigations.
- Powered by **Ollama** running models like **Gemma 3** or **Gemma 4**.
- Uses EasyOCR, PyMuPDF, and Pillow.

### Option 2: Cloud AI (Recommended for Speed)
Leverage the massive reasoning power of cloud LLMs for lightning-fast processing of massive evidence dumps.
- Powered by **Google Gemini (Flash / Pro)**.
- Uses EasyOCR, PyMuPDF, and Pillow.

---

## 🛠️ The Tech Stack

Building a system this complex requires serious horsepower. Here's what's running under the hood:

### Frontend (The Command Center)
- **React 18, TypeScript, & Vite:** For blazing fast rendering.
- **Tailwind CSS & shadcn/ui:** Because police software shouldn't look like it was built in 1995. We use a premium UI with an **Interactive Timeline**, **Evidence Locker**, and **Knowledge Graph**.
- **Framer Motion:** For smooth transitions and micro-animations.

### Backend (The Engine)
- **FastAPI (Python):** Insanely fast, and perfect for handling asynchronous AI multi-agent workflows.
- **MongoDB:** A NoSQL database that perfectly handles our complex, unstructured Knowledge Graph and case audit logs.
- **ReportLab:** To dynamically generate beautiful court-ready PDFs.

---

## 🚀 Getting Started & Installation

If you want to spin up the investigation lab on your own machine, follow these steps.

### Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB Community Server
- npm
- Git
- *Optional:* Ollama (for local AI) or Gemini API Key (for cloud AI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Forensix
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
```

**Environment Configuration:**
Create a `.env` file inside the `backend` directory. You must choose *either* Ollama or Gemini as your AI Provider.
```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=forensix_db

# Choose ONE provider:
AI_PROVIDER=ollama   
# OR
# AI_PROVIDER=gemini

# --- If you chose Ollama ---
OLLAMA_MODEL=gemma3
OLLAMA_BASE_URL=http://localhost:11434

# --- If you chose Gemini ---
GEMINI_API_KEY=YOUR_API_KEY
```
*(Note: If using Ollama, make sure you have pulled the model first: `ollama pull gemma3`)*

**Start Backend:**
```bash
uvicorn app:app --reload
```

### 3. Frontend Setup
Open a new terminal window.
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🕵️ Running Your First Investigation

1. **Create a Case** in the dashboard.
2. **Upload evidence** (Try our sample datasets like Financial Fraud or Phishing).
3. Click **Run AI Engine**.
4. Wait for the processing to finish.
5. **Explore the Intelligence:** Dive into the Overview, Evidence Locker, Interactive Timeline, Knowledge Graph, and generate your Court Reports!

---

## 🚧 Troubleshooting

- **MongoDB Connection Error:** Verify MongoDB is running (run `mongod` in terminal) or ensure the connection string is correct (`mongodb://localhost:27017`).
- **Backend Not Starting:** Ensure your Python virtual environment is activated and `.env` is properly configured.
- **AI Not Responding:** Verify your Gemini API Key or ensure the Ollama service is running (`ollama list`). Check backend logs for specific timeout errors.

---

## 🔮 Future Improvements
Criminals don't stop evolving, and neither do we. In the future, Forensix will support:
- Video Evidence Analysis & Audio Transcription
- Face Recognition & Device Forensics
- Cellebrite / UFDR Import Support
- Multi-user Collaboration & Role-Based Access Control
- Chain of Custody Tracking

---

## 👥 Team
- **Piyush Jaiswal** 
- *(Add remaining team members)*

---

## 📜 License
Developed for **Police Hackathon 2026**. 
This project demonstrates how AI-assisted investigation can help law enforcement process digital evidence faster while keeping every finding grounded in uploaded evidence.
