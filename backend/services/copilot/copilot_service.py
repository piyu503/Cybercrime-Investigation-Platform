from bson import ObjectId
from database.mongodb import get_database
from services.llm.ollama_client import generate_content_async


COPILOT_PROMPT = """
You are the Forensix AI Copilot, an expert digital forensics assistant supporting law enforcement.
Answer the user's question using ONLY the provided Case Context.
Do NOT invent information. If the answer is not in the context, say so clearly.
Be structured, professional, and cite specific evidence or timeline events where applicable.

User Question: {question}

--- CASE CONTEXT ---
{context}
"""


async def ask_copilot(case_id: str, question: str) -> str:
    db = get_database()
    case = await db["cases"].find_one({"_id": ObjectId(case_id)})
    if not case:
        raise ValueError("Case not found")

    context_parts = []

    # 1. Timeline
    timeline = case.get("timeline", [])
    if timeline:
        context_parts.append("TIMELINE OF EVENTS:")
        for ev in timeline[:20]:  # limit to avoid token overflow
            date = ev.get("timestamp", "Unknown")
            desc = ev.get("description", "")
            srcs = ", ".join(ev.get("supporting_evidence", ev.get("source_files", [])))
            context_parts.append(f"  [{date}] {desc} (Sources: {srcs})")

    # 2. Intelligence / Summary
    intelligence = case.get("intelligence", {})
    if intelligence:
        summary = intelligence.get("summary", {})
        if isinstance(summary, dict):
            overview = summary.get("case_overview", "")
            if overview:
                context_parts.append(f"\nCASE OVERVIEW:\n{overview}")
            findings = summary.get("critical_findings", [])
            if findings:
                context_parts.append("\nCRITICAL FINDINGS:")
                for f in findings:
                    context_parts.append(f"  - {f}")
        elif isinstance(summary, str) and summary:
            context_parts.append(f"\nSUMMARY:\n{summary}")

        contradictions = intelligence.get("contradictions", [])
        if contradictions:
            context_parts.append("\nCONTRADICTIONS:")
            for c in (contradictions[:5] if isinstance(contradictions[0], dict) else contradictions[:5]):
                if isinstance(c, dict):
                    context_parts.append(f"  - {c.get('reason', c)}")
                else:
                    context_parts.append(f"  - {c}")

        recs = intelligence.get("recommendations", intelligence.get("recommended_actions", []))
        if recs:
            context_parts.append("\nRECOMMENDATIONS:")
            for r in (recs[:5]):
                if isinstance(r, dict):
                    context_parts.append(f"  - {r.get('action', r.get('reason', r))}")
                else:
                    context_parts.append(f"  - {r}")

    # 3. Knowledge Graph Entities
    kg = case.get("knowledge_graph", {})
    if kg:
        nodes = kg.get("nodes", [])
        entities = [n.get("label", "") for n in nodes if n.get("label")]
        if entities:
            context_parts.append(f"\nKEY ENTITIES: {', '.join(entities[:30])}")

    # 4. Evidence files
    files = case.get("files", [])
    if files:
        context_parts.append("\nEVIDENCE FILES:")
        for f in files[:10]:
            fname = f.get("filename", "Unknown")
            classification = f.get("processed_data", {}).get("classification", "Unclassified")
            context_parts.append(f"  - {fname} ({classification})")

    context_str = "\n".join(context_parts) if context_parts else "No case data available yet. Please run the AI Engine first."

    prompt = COPILOT_PROMPT.format(question=question, context=context_str)

    try:
        return await generate_content_async(prompt)
    except Exception as e:
        raise RuntimeError(f"Copilot failed: {e}")
