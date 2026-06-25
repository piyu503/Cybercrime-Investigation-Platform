from datetime import datetime
from bson import ObjectId
from database.mongodb import get_database

async def log_audit_event(case_id: str, action: str, user: str, status: str, details: str = ""):
    """
    Logs an action to the audit_logs collection for a specific case.
    """
    db = get_database()
    log_entry = {
        "case_id": case_id,
        "timestamp": datetime.utcnow(),
        "action": action,
        "user": user,
        "status": status,
        "details": details
    }
    await db["audit_logs"].insert_one(log_entry)

async def get_audit_trail(case_id: str):
    """
    Retrieves the audit trail for a case, sorted by timestamp descending.
    """
    db = get_database()
    cursor = db["audit_logs"].find({"case_id": case_id}).sort("timestamp", -1)
    
    logs = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        logs.append(doc)
    return logs
